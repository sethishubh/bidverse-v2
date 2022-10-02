const express = require("express");
var cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const bidRouter = require("./routes/bidRoutes");
const productRouter = require("./routes/productRoutes");

// Start the express app
const app = express();

// CORS handler (or use "proxy" in package.json)
// app.use((req, res, next) => {
//   // res.setHeader("Access-Control-Allow-Origin", "*");
//   // // res.setHeader("Origin, X-Requested-With, Content-Type, Accept, Authorization");
//   // res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");

//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
//   );
// });

app.use(cors());

// BODY PARSER: reading the data from body into req.body ie It parses the data from the body
app.use(express.json({ limit: "10kb" })); // Middleware to add data from the 'incoming request body' to 'request object' for post route
// limit:10kb -> limiting the amount of data to 10kb that comes in the body
// So if we have body larger than 10kb, it will not be accepted
app.use(cookieParser());

// Routers
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/bids", bidRouter);

// // Global error handling middleware with 4 (extra 'err') parameters
// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || "error"; //ie fail,error from like above or 'error'

//   if (process.env.NODE_ENV === "development") {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//       error: err,
//       stack: err.stack,
//     });
//   } else if (process.env.NODE_ENV === "production") {
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//       error: err,
//       stack: err.stack,
//     });
//   }
// });

module.exports = app; //exporting for use in server.js file
