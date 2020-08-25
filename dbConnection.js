const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const router = require("express").Router();

const conn = mongoose.connect(process.env.DB_CONN, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

module.exports = db;
