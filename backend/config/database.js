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
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDatabase;
