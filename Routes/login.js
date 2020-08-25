const mongoose = require("mongoose");
const router = require("express").Router();
const Users = require("../Models/Users");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const user = await Users.findOne({ email: req.body.email });
  console.log(user);
  try {
    if (user == null) {
      res.status(401).send("User not found. Please register");
    } else if (
      user.email != req.body.email ||
      user.password != req.body.password
    ) {
      return res.status(401).send("Wrong username/password");
    } else {
      const token = jwt.sign(
        { email: user.email },
        process.env.ACCESS_TOKEN_SECRET
      );
      //res.send("Auth-Token", token);
      return res.status(201).send({ token: token });
    }
  } catch (err) {
    return res.status(500).send({ err: err });
  }
});

module.exports = router;
