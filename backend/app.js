const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./midddleware/error");

const app = express();

app.use(express.json());
app.use(cors());

// Route imports
const product = require("./routes/productRoute");

app.use("/api/v1", product);

// Middleware for Errors : -
app.use(errorMiddleware);

module.exports = app;
