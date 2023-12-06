const connectDB = require("./db/connect");
require("dotenv").config();
const products = require("./products.json");
const Product = require("./models/Product");

const populateData = async () => {
  try {
    await connectDB(process.env.MONGO_DB_URI);
    console.log("Logged in");
    await Product.deleteMany({});
    await Product.create(products);
    console.log("Test Data Populated");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

populateData();
