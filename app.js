const express = require("express");
require("express-async-errors");
require("dotenv").config();
const connectDB = require("./db/connect");
const notFoundMiddleWare = require("./middlewares/not-found");
const errorHandlerMiddleWare = require("./middlewares/error-handler");
const product = require("./routes/product");

const app = express();
const PORT = process.env.PORT || 6000;
const MONGO_DB_URI = process.env.MONGO_DB_URI;

// MIDDLEWARE TO PARSE REQUEST BODY
app.use(express.json());

// HOME PAGE ROUTE FOR UI
app.get("/", (req, res) => {
  return res
    .status(200)
    .send(
      '<h1>welcome</h1> <a href="/api/v1/products">go to products page</a>'
    );
});

// ROUTES
app.use("/api/v1/products", product);

// FOR INVALID ROUTE PATH'S
app.use(notFoundMiddleWare);

// ERROR HANDLER MIDDLEWARE TO HANDLE INCOMING ERROR'S FROM CONTROLLER'S
app.use(errorHandlerMiddleWare);

// STARTUP FUNCTION TO CONNECT MONGO DB THEN LISTEN TO SERVER
const startApp = async () => {
  try {
    console.log(`connecting to db using url => ${MONGO_DB_URI}`);
    await connectDB(MONGO_DB_URI);
    console.log("connected to db...");
    app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

startApp();
