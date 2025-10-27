const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  GOOD_STATUS_CODE,
  CREATE_STATUS_CODE,
  BAD_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

const getUser = (req, res) => {
  User.find({})
    .then((users) => res.status(GOOD_STATUS_CODE).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Server Error" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => res.status(CREATE_STATUS_CODE).send(user))
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res.status(409).send({
          message: "Email already exists",
        });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_STATUS_CODE).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Server Error" });
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("Item ID not found");
      error.statusCode = NOT_FOUND_STATUS_CODE;
      throw error;
    })
    .then((user) => res.status(GOOD_STATUS_CODE).send(user))
    .catch((err) => {
      console.error(err);
      if (err.statusCode === NOT_FOUND_STATUS_CODE) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Document Not Found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_STATUS_CODE).send({ message: "Bad Request" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Server Error" });
    });
};

module.exports = { getUser, createUser, getUserId };
