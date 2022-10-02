//Authentication Controller: Here we do stuff related to user's authentication
const crypto = require("crypto");
const promisify = require("promisify");
const jwt = require("jsonwebtoken");

const User = require("./../models/userModel"); //Importing User model

const signToken = (id) => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      // JWT_COOKIE_EXPIRES_IN = 90 is in days so converting it into ms
    ),
    //secure: true, //cookie will only be sent on an encrypted/https connection
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true; // ie cookie will only be sent on an encrypted/https connection
  }
  res.cookie("jwt", token, cookieOptions); // Sending cookie in response

  //Remove password from output results in postman
  user.password = undefined;

  // Logging in a new user just created by sending token too to client/user below

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try {
    // Create new User doc
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      passwordResetToken: req.body.passwordResetToken,
      passwordResetExpires: req.body.passwordResetExpires,
      role: req.body.role,
    });

    // Sign the user-in right away by sending him a jwt
    createSendToken(newUser, 201, res);
  } catch (error) {
    res.status(500).json({
      status: "failed",
      error: error.message,
    });
  }
};

// Logging a user in based on a given email and password
exports.login = async (req, res, next) => {
  const { email } = req.body; // const email = req.body.email;
  const { password } = req.body;

  // 1) Check if email and p/w exist
  if (!email || !password) {
    //   return next(new Error("Please provide email and password", 400));
    return res.status(500).json({
      status: "failed",
      error: "Please provide email and password",
    });
    // return becoz after calling the next middleware, we want to make sure that this login f'n here finishes right away
  }

  // 2) Check if user exists & p/w is correct

  // ie checking if there actually is a user for the email that was posted; by using findOne to search user by email
  const user = await User.findOne({ email: email }).select("+password");
  // select+ here to select field that was by-default not selected;as p/w is not selected by default to show up in o/p as it is select:false in schema
  // So we use select+ to select p/w field to show up in o/p
  // const user above = user doc as it is result of querying user model so now we can use instance method correctPassword() on this 'above created user' document;

  if (!user || !(await user.correctPassword(password, user.password))) {
    //!user = there is no user, !correct = entered p/w is incorrect
    //   return next(new Error("Incorrect email or password", 401));
    return res.status(500).json({
      status: "failed",
      error: "Incorrect email or password",
    });
  }

  // 3) If everything (1) and 2) ) ok, send token to client

  createSendToken(user, 200, res);
};

exports.logout = (req, res) => {
  //Below-> res -> response ; loggedout -> dummy/random text
  //Below-> So, again, on the response we set the cookie, and the secret is to give it the exact same name('vch is 'jwt' here' ie in -> exports.createSendToken -> res.cookie('jwt', token, cookieOptions); ) and that is jwt. So just as I mentioned in above/before comments.
  res.cookie("jwt", "loggedout", {
    //So, the jwt that we are sending now as/in the cookie just above is 'loggedout' and then in exports.isLoggedIn(in code-> await promisify(jwt.verify)) f'n, this 'loggedout' jwt will be verified and the verification will be failed now there and so jwt.verify will trigger an error there vch we catched in catch(err) there and So then in that case we want to go to next middleware (coz in exports.isLoggedIn -> catch(err) { return next(); } will be run in this case -> So, we go straight to the next middleware when there is no logged-in user) so basically saying that there is no logged-in user <- this whole trick/process is for logging out user in website
    expires: new Date(Date.now() + 10 * 1000), //expire date in 10 sec from now
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

// Protect middleware for log-in / authentication
// Creating middleware f'n below to protect routes f'n from unauthorized access
// So we will allow only logged in users to access the protected routes
exports.protect = async (req, res, next) => {
  // 1) Getting token and checking if it's there (ie if token actually exists)

  // A comman practice is to "send a token using an http header" along with req coz user/client will have to send his token( or show his passport) along with req to server to basically access a protected route
  // we set token in(as) header in postman using Authorization(header's name/key) = Bearer:randomString(ie Bearer:value of token/header where Bearer coz we bear/we have/ we possess/we ourselves create this token in postman ) So token here = randomString
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    //Above-> req.headers.authorization = reading jwt from authorization header and only if that authorization header starts with 'Bearer', so for the bearer token in postman
    //Contd... But now, we basically ALSO want to read the json web token from a cookie(that was sent by the browser(for a logged-in user) along with the req(to show cookie as passport while doing req to API) and cookie has jwt stored in it) and so adding else if here above
    // meaning of above else if->  if there was no token in the authorization header then we run this else if
    // in the cookies object, there will be a property called JWT

    token = req.cookies.jwt;
    // And so now with this above code, we're also able to authenticate users based on tokens sent via cookies and not only the authorization header
  }

  // if there is no token sent with req, then that means we are not logged in (below)
  if (!token) {
    res.status(401).json({ status: "You are not logged in! Please log in to get access" });
    return;
  }

  // 2) Validating token /verification of token ie JWT algorithm verifies if the signature of received token is valid or not( and so if the received token is valid or not) so whether it matches the token's signature that was actually sent to user originally at first place
  // Also verifying here if the token has already expired
  // Below callback f'n will run as soon as verification of token has completed
  // verify below is async f'n so it will verify token and then it'll run callback f'n

  // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log(error);
    res.status(401).json({ status: "Invalid token" });
    return;
  }

  // const decodedToken = jwt.verify(token, 'supersecret_dont_share');
  // req.userData = { userId: decodedToken.userId };

  // decoded = The resolved value of promise is 'decoded payload'(= user id of current user) from token
  // verify is synchronous f'n above and so we cant have synchronous f'n inside above declared asynchronous protect f'n so we made it asynchronous too by making it return promise by promisifying it

  // console.log(decoded); // { id: '5e9ee62569ad7a4bf89f805c', iat: 1587553955, exp: 1595329955 }

  // 3) Check if user who is trying to access route still exists

  // So if the user has been deleted in meantime and token will still exist then we dont want to log in user
  // So checking below if user still exists
  // decoded = 'decoded payload' and 'decoded payload' has user id of currently logged in user (ie currentUser)
  const currentUser = await User.findById(decoded.userId);

  if (!currentUser) {
    res.status(401).json({ status: "The user belonging to this token does no longer exist" });
    return;
  }

  // so then below we assign currentUser to request object (ie req.user) in order to use it in next middleware f'n if needed in future
  //(continued from above comment) coz req object travels from one middleware to another middleware and so if we want to pass the data from one middleware to next one, then we can simply put some property(stuff) on req object and that data will be available at later point
  req.user = currentUser; //Putting entire user data(ie Putting currentUser(ie Currently logged-in user)) on the req so that we can use it( currentUser -> Currently logged-in user) in all the APIs

  // GRANT ACCESS TO PROTECTED ROUTE IF ALL ABOVE STEPS PASSED
  next(); //If above all steps are passed then only we will go to next() middleware/route
};
