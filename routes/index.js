const router = require("express").Router();
const express = require("express");
const { auth } = require("../middleware/auth");

const { NOT_FOUND_STATUS_CODE } = require("../utils/errors");
const userRouter = require("./users");
const clothingRouter = require("./clothingItems");
const { createUser, userLogin } = require("../controllers/user");
const { getItems } = require("../controllers/clothingItems");

const app = express();

router.post("/signup", createUser);
router.post("/signin", userLogin);
router.get("/items", getItems);
router.use("/users", auth, userRouter);
router.use("/items", auth, clothingRouter);
router.use((req, res) => {
  res
    .status(NOT_FOUND_STATUS_CODE)
    .send({ message: "Requested resource not found" });
});

module.exports = router;
