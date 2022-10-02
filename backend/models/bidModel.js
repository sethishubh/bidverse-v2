const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    // user who made a bid
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    madeAtPrice: {
      type: Number,
      required: [true, "A bid must have a price."],
    },
    paid: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//POST-FIND MIDDLEWARE: Post-find hook: runs after find() query is executed
//Here 'docs' is doc returned after query is executed

// bidSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseaconds`);
//   //console.log(docs); //docs that matched previous query
//   next();
// });

const Bid = mongoose.model("Bid", bidSchema);

module.exports = Bid;
