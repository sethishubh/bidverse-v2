const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  console.log(err.name, err.message, err);
  process.exit(1); // 1 = uncaught exception, 0 = success
  // process.exit = app crashed
});

// config file
dotenv.config({ path: "./config.env" });

// express App
const app = require("./app");

mongoose
  .connect(process.env.DATABASE_CONNECT_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  });

const port = process.env.PORT || 5000;

// Express app connection
const server = app.listen(port, () => {
  console.log(`App running on port ${port}... `);
});

// HANDLING UNHANDLED PROMISE REJECIONS (ie in asynchronous code)
// Unhandled promise rejection: it means that somewhere in our code, there is a promise that got rejected but that rejection has not been handled anywhere using catch
//So globally handling rejected promises below: so we are handling globally rejected promises that we might not have been caught somewhere in our code
//So each time, there is an unhandled rejection somewhere in our application, the process object will then emit an object(event) called unhandled rejection, so we can subscribe to that event just like below
//process.on("Name of the event we are subscribing to", callback f'n called when this event is emitted);

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message, err);

  server.close(() => {
    process.exit(1);
  });
});

// HANDLING UNCAUGHT EXCEPTIONS
//Uncaught exceptions: These are all errors/bugs that occur in our synchronous code but not handled anywhere
