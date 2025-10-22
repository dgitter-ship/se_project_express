const router = require("express").Router();
const express = require("express");

const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");
const userRouter = require("./users");
const clothingRouter = require("./clothingItems");

const app = express();

router.use("/users", userRouter);
router.use("/items", clothingRouter);
app.use((req, res) => {
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
