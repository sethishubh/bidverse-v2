const express = require("express");

const productController = require("../controllers/productController");
const authController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(authController.protect, productController.createProduct);

router
  .route("/:productId")
  .get(productController.getProduct)
  .patch(authController.protect, productController.updateProduct)
  .delete(authController.protect, productController.deleteProduct);

module.exports = router;
