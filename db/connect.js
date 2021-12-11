const mongoose = require('mongoose');

const connectDB = (url) => {
  return mongoose.connect(url).then(() => {
    console.log("success db")
  });
};

module.exports = connectDB;
