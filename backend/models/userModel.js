const crypto = require("crypto"); // Built-in node module; No need to install anything
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    photo: {
      //  path to the photo that was uploaded in our file system
      type: String,
      default: "default.jpg", //  All the newly created users will have this default image as their profile pic/photo
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 6,
      select: false, // false for not showing p/w in any o/p while sending data or o/p to client by reading it from db
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please provide a password"],
      validate: {
        // 'this' below points to current doc on NEW doc creation and it will NOT work on updating doc
        //  So below function works only for new doc creation ie ONLY on CREATE AND SAVE( '.save() and .Create() method' ).
        //  And for due to above reason, whenever we want to update a user, we will always have to use SAVE ( '.save() method' ) as well and NOT for example findOne, findOneAndUpdate
        //  If we updated the user's p/w simply with a regular update, then in that case the p/w confirm validation that we have here will no longer work so we will have to there update user also with .save() or .create()
        //  So this will only work when we create a new object so on .create() or .save()
        validator: function (el) {
          //  It is callback f'n which will be called when new doc is created
          // el -> current element -> passwordConfirm
          return el === this.password; //  true -> no validation error; false -> validation error
        },
        message: "Passwords are not the same",
      },
      role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date, //  when reset token expires, reset will expire after a certain amount of time as a security measure. So you will only have 10 minutes( for e.g.) in order to actually reset ur p/w
    //  Date on which the p/w was changed and this property/object will exist on only those users who have actually changed their p/w and so if user has not changed his p/w ever since signup then this property will not be in his data
    isActive: {
      //  User account status
      type: Boolean,
      default: true, //  ie By default user account is active
      select: false, //  ie we dont want this schema property to show up in results( o/p ) in postman
    },
    bidsMade: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Bids", // Reference to Bids model/collection ie relationship b/w two datasets/collections; works even w/o requiring user model into this file
      },
    ],
    bidsWon: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Bids",
      },
    ],
  },
  { timestamps: true }
);

//  PASSWORD ENCRYPTION(HASHING)

//  Using Mongoose middleware for p/w encryption: So the middleware f'n (which will do encryption here) will run b/w the moment that we receive the data and the moment where it's actually saved to db
// So encryption would have happened before actually saving the data below
// Using PRE-SAVE DOCUMENT MIDDLEWARE
// 'this' below -> current doc/user

userSchema.pre("save", async function (next) {
  // Only run this f'n if p/w was actually modified
  if (!this.isModified("password")) return next(); // ie if p/w has not been modified, exit the f'n and call next() middleware

  // Using bcrypt hashing algorithm below // npm i bcryptjs -> install bcrypt package
  // hash = Asynchronously generates a hash for the string (this.password below) and as it(hash) is an async f'n, it will return a promise, so we added async await now
  this.password = await bcrypt.hash(this.password, 12); //  12 -> cost parameter -> higher cost -> more CPU intensive process to encrypt p/w  -> more secure p/w

  // Deleting passwordConfirm here below by setting it to undefined as we only need passwordConfirm field for p/w validation and after validation is successful, we no longer need this p/wConfirm field So we don't want to save this p/wConfirm to db so deleting below
  this.passwordConfirm = undefined;
  next();
});

//  We dont want to show up inactive users (ie users with active:false in db) in o/p(ie results of postman) in getAllUsers so we are using
// ..contd pre-query middleware below which will run before any db mongoose query
//  this pre-"find-query" middleware will run before every other mongoose query that starts with find like find, findAndUpdate, findAndDelete etc..
//  And so by using this we will show up users with active:true (ie only users having account status active) in o/p results in postman
userSchema.pre(/^find/, function (next) {
  //  this here points to current query
  this.find({ isActive: { $ne: false } });
  // So all the User-Model docs where isActive is not equal to false should now show up in o/p results on postman
  next();
});

// Creating f'n for checking if entered p/w by user = stored p/w of that user
// Creating instance method (A method which is gonna be available on all documents (user documents here coz created out of userSchema) of a certain collection) correctPassword here
//  correctPassword = method's name; candidatePassword = non-encrypted p/w that the user passes in body so this is p/w that the user is entering to login and so is non-encrypted
// userPassword = encrypted stored p/w of user trying to log in
// So using Compare F'n (For comparing hashed p/w(encrypted p/w) against plain entered p/w) below will return true if entered p/w = stored p/w and otherwise false

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Creating 'U'ser ('U'ser coz model variables are always capital) model out of above schema
const User = mongoose.model("User", userSchema);

module.exports = User;
