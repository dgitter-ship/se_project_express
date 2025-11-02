const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  GOOD_STATUS_CODE,
  CREATE_STATUS_CODE,
  BAD_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  UNAUTHORIZED_STATUS_CODE,
  CONFLICT_STATUS_CODE,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

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
    .then((user) => {
      const obj = user.toObject();
      delete obj.password;

      res.status(CREATE_STATUS_CODE).send(obj);
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res.status(CONFLICT_STATUS_CODE).send({
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

const getCurrentUser = (req, res) => {
  const { _id } = req.user;
  console.log(_id);
  User.findById(_id)
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

const userLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(BAD_STATUS_CODE).send({
      message: "Email and password are required",
    });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED_STATUS_CODE)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Server Error" });
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;
  const { _id } = req.user;

  User.findByIdAndUpdate(
    _id,
    { $set: { name, avatar } },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "User not found" });
      }
      return res.status(GOOD_STATUS_CODE).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_STATUS_CODE)
          .send({ message: "Invalid data provided" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: err.message });
    });
};

module.exports = { getUser, createUser, getCurrentUser, userLogin, updateUser };
