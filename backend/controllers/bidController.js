const Bid = require("../models/bidModel");

exports.createBid = async (req, res, next) => {
  const userId = req.user.id.toString();
  try {
    const newBid = await Bid.create({ ...req.body, user: userId });

    res.status(201).json({
      status: "success",
      data: {
        bid: newBid,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getAllBids = async (req, res, next) => {
  try {
    const bids = await Bid.find();

    res.status(200).json({
      message: "success",
      data: {
        bids,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getBidsByUser = async (req, res, next) => {
  const userId = req.user._id;
  try {
    // const bid = await Bid.findById(req.params.bidId); // or  Bid.findOne({_id: req.params.bidId})
    const bids = await Bid.find({ user: userId }).populate("product"); // or  Bid.findOne({_id: req.params.bidId})
    //Here bidId in req.params.bidId is bidId in router ".route('/:bidId')" in productRoutes.js

    console.log(bids);

    res.status(200).json({
      message: "success",
      data: {
        bids,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
  next();
};

exports.deleteBid = async (req, res) => {
  try {
    await Bid.findByIdAndDelete(req.params.bidId);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
