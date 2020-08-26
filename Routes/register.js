const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const Users = require("../Models/Users");

router.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const isUserExists = await Users.findOne({ email: email });
    if (isUserExists != null) {
      res.status(401).send("User already exists, please try to login.");
    } else {
      const bcryptedPassword = await bcrypt.hash(password, 10);
      console.log(bcryptedPassword);
      const user = new Users({
        name,
        email,
        password: bcryptedPassword,
      });
      console.log("1");
      const savedUser = await user.save();
      res.status(201).send(savedUser);
    }
  } catch (err) {
    res.status(500).send({ err: err });
  }
});

module.exports = router;
