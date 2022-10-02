const express = require("express");

const bidController = require("../controllers/bidController");
const authController = require("../controllers/authController");

const router = express.Router();

// authController.protect => only for logged-in (authenticated) users

router.route("/").get(bidController.getAllBids).post(authController.protect, bidController.createBid);

// router
//   .route("/:bidId")
//   .get(bidController.getBid)
//   .patch(authController.protect, bidController.updateProduct)
//   .delete(authController.protect, bidController.deleteBid);

router.route("/bidsByUser").get(authController.protect, bidController.getBidsByUser);

module.exports = router;
