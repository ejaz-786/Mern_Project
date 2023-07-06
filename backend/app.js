const express = require("express");
const cors = require("cors");
const errorMiddleware = require("./midddleware/error");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Route imports
const product = require("./routes/productRoute");
const user = require("./routes/userRoute");

app.use("/api/v1", product);
app.use("/api/v1", user);

// Middleware for Errors : -
app.use(errorMiddleware);

module.exports = app;
