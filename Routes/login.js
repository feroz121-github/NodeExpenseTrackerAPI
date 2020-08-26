const mongoose = require("mongoose");
const router = require("express").Router();
const Users = require("../Models/Users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  console.log(user);
  try {
    if (user == null) {
      res
        .status(401)
        .send({ data: null, msg: "User not found. Please register" });
    } else if (
      user.email != req.body.email ||
      (await bcrypt.compare(req.body.password, user.password)) == false
    ) {
      return res
        .status(401)
        .send({ data: null, msg: "Wrong username/password" });
    } else {
      console.log(bcrypt.compare(req.body.password, user.password));
      const token = jwt.sign(
        { email: user.email },
        process.env.ACCESS_TOKEN_SECRET
      );
      return res.status(201).send({ token: token });
    }
  } catch (err) {
    return res.status(500).send({ err: err });
  }
});

module.exports = router;
