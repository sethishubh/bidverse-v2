// ROUTE HANDLER FUNCTIONS

const User = require("./../models/userModel");

//Implementing '/me endpoint/route' ie endpoint where a logged-in user can retrieve his own data (ie for e.g. like getting his profile in fb )
exports.getMe = (req, res, next) => {
  req.params.userId = req.user.id; // (ie id the getOne uses in handlerFactory = id from currently logged-in user from req.user = currentUser from authController.protect midlleware f'n (which is middleware for logging in user)
  //ie above coz getOne in handlerFactory uses the id coming from parameter (ie req.params.id) to get the requested doc but we want to get the doc based on the current user Id (ie Id coming from the currently logged-in user -> req.user.id) from req.user = currentUser and so we dont need to pass any id in url as parameter
  //..contd and thats why we added this getMe middleware (to set req.params.id = req.user.id ) to run before calling getOne/getUser and we go to next middleware (which is getOne/getUser coz in userRoutes.js -> router.get('/me', authController.protect, userController.getMe, userController.getUser); ) by calling next() below
  //And as we are calling authController.protect ie we want logged-in user to access his profile data so we need to add Bearer token in authorization tab in postman while sending req

  next();
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId); // or  Product.findOne({_id: req.params.productId})
    //Here productId in req.params.productId is  productId in router ".route('/:productId')" in productRoutes.js

    res.status(200).json({
      message: "success",
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
