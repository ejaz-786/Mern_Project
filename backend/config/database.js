const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
    })
    .then((data) => {
      console.log(`mongDB has been connected with :${data.connection.name}`);
    });

  // .catch((err) => {
  //   console.log(err);
  // }); // removed because this error is handle in server.js unhandled Promise Rejection
};

module.exports = connectDatabase;
