const mongoose = require("mongoose");
// const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A product must have a name"],
      unique: true,
      trim: true,
    },
    slug: String,
    category: {
      type: String,
      required: [true, "A product must have a category"],
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    bids: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Bid",
      },
    ],
    basePrice: {
      type: Number,
      required: [true, "A product must have a base price"],
      min: [1, "Price must be above 1.0"],
    },
    highestBidPrice: Number,
    timesVisited: Number,
    description: {
      type: String,
      trim: true,
    },
    imageURL: {
      type: String, // Name of the image will be string
      required: [true, "Product image is required"],
    },
    // createdAt: {
    //   type: Date,
    //   default: Date.now(), // Timestamp of current millisecond
    //   select: true, // For hiding this field in response
    // },
    closesAt: {
      type: Date,
      required: [true, "A product must have a close bid Date"],
    },
  },
  { timestamps: true }
);

// POST-FIND MIDDLEWARE: Post-find hook: runs after find() query is executed
// Here 'docs' is doc returned after query is executed

// productSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseaconds`);
//   // console.log(docs); // docs that matched previous query
//   next();
// });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
