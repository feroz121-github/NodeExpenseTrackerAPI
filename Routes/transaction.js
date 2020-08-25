const mongoose = require("mongoose");
const UserTransaction = require("../Models/UserTransactions");
const Users = require("../Models/Users");
const jwt = require("jsonwebtoken");
const UserTransactions = require("../Models/UserTransactions");
const router = require("express").Router();

router.get("/", fnJWTAuthenticate, async (req, res) => {
  try {
    const user = await fnCurrentUser(req.user.email);
    if (user == null)
      return res.status(204).send({ data: null, message: "no user found" });
    if (user) {
      const transactions = await UserTransaction.find({ email: user.email });
      console.log(transactions);
      if (transactions.length === 0) NoTransactionFound(res);

      //if transactions found
      res.status(201).send(transactions);
    }
  } catch (err) {
    res.status(500).send({ err: err });
  }
});

router.post("/", fnJWTAuthenticate, async (req, res) => {
  try {
    if (req.body.transactionName && req.body.amount && req.body.type) {
      const { transactionName, amount, type } = req.body;
      const email = req.user.email;
      const transaction = new UserTransaction({
        transactionName,
        amount,
        type,
        email,
      });
      const savedtransaction = await transaction.save();
      res.status(201).send(savedtransaction);
    } else {
      res.status(400).send({
        data: null,
        message: "Name, Amount and Type of transaction cannot be empty",
      });
    }
  } catch (err) {
    return res.status(500).send({ err: err });
  }
});

router.patch("/:id", fnJWTAuthenticate, async (req, res) => {
  try {
    const id = req.params.id;
    const { transactionName, amount, type } = req.body;
    const email = req.user.email;
    const objNewTransData = { transactionName, amount, type };
    const transaction = await UserTransaction.findById(id);
    console.log(transaction);
    if (transaction == null) {
      return res
        .status(404)
        .send({ data: null, message: "No Transaction found" });
    }
    const updatedTransaction = await UserTransaction.updateOne(transaction, {
      $set: objNewTransData,
    });
    return res.status(201).send(updatedTransaction);
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.delete("/:id", fnJWTAuthenticate, async (req, res) => {
  try {
    const id = req.params.id;
    const email = req.user.email;
    const transaction = await UserTransaction.findById(id);
    if (transaction == null)
      return res
        .status(404)
        .send({ data: null, message: "No transaction found" });
    const delTransaction = await UserTransaction.deleteOne(transaction);
    if (delTransaction.ok)
      res.status(201).send({
        data: delTransaction.deletedCount,
        message: "Transaction deleted",
      });
  } catch (err) {
    res.status(500).send({ err: err });
  }
});

const fnCurrentUser = async (email) => {
  try {
    const user = await Users.findOne({ email: email });
    return user;
  } catch (err) {
    return err;
  }
};

function fnJWTAuthenticate(req, res, next) {
  try {
    const token = req.get("Auth-Token");
    if (token == null)
      return res.status(401).send({ message: "Not authorized" });

    jwt.verify(
      req.get("Auth-Token"),
      process.env.ACCESS_TOKEN_SECRET,
      (err, user) => {
        if (err) return res.status(403).send(err);
        req.user = user;
        next();
      }
    );
  } catch (err) {
    return res.status(500).send(err);
  }
}

function NoTransactionFound(res) {
  return res.status(404).send({ data: null, message: "No Transaction found" });
}

module.exports = router;
