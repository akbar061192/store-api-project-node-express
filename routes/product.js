const express = require("express");
const {
  getAllProducts,
  getAllProductsStatic,
} = require("../controllers/product");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/static", getAllProductsStatic);

module.exports = router;
