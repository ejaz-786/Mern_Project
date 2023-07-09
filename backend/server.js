const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Handling Uncaught Exception (like if the variable is not defined..)
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.stack}`);
  console.log(`Server is shutting down due to Uncaught Exception.`);
  process.exit(1);
});

//config:-
dotenv.config({ path: "backend/config/config.env" });

// connecting to database:-

connectDatabase();

// start server:-
const server = app.listen(process.env.PORT, () => {
  console.log(`app is running on http://localhost:${process.env.PORT}`);
});

// console.log(Ejaz); // (uncaught exception )

// unhandled Promise Rejection: (when mongoconnect string is wrong ):-

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled Promise Rejection.");

  server.close(() => {
    process.exit(1);
  });
});
