const express = require("express");
const app = express();
const port = process.env.SERVER_PORT;
const dontenv = require("dotenv").config();
const mongoose = require("mongoose");
const dbConnection = require("./dbConnection");
const registerRoute = require("./Routes/register");
const loginRoute = require("./Routes/login");
const transactionRoute = require("./Routes/transaction");

//Port
app.listen(process.env.SERVER_PORT);

//Middlewares
app.use(express.json());
app.use("/api/register", registerRoute);
app.use("/api/login", loginRoute);
app.use("/api/transaction", transactionRoute);
