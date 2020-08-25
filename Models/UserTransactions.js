const mongoose = require("mongoose");

const userTransactionsSchema = new mongoose.Schema({
  transactionName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: Date,
    default: Date.now(),
  },
  email: {
    type: String,
    ref: "Users",
    required: true,
  },
});

module.exports = mongoose.model("UserTransactions", userTransactionsSchema);
