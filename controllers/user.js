const User = require("../models/user");
const {
  goodStatusCode,
  createStatusCode,
  badStatusCode,
  notFoundStatusCode,
  internalServerErrorCode,
} = require("../utils/statusCodes");

//GET Users

const getUser = (req, res) => {
  User.find({})
    .then((users) => res.status(goodStatusCode).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(internalServerErrorCode).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({
    name,
    avatar,
  })
    .then((user) => res.status(createStatusCode).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(badStatusCode).send({ message: err.message });
      }
      return res.status(internalServerErrorCode).send({ message: err.message });
    });
};

const getUserId = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => res.status(goodStatusCode).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundStatusCode).send({ message: err.message });
      } else if (err.name === "CastError") {
        return res.status(badStatusCode).send({ message: err.message });
      }
      return res.status(internalServerErrorCode).send({ message: err.message });
    });
};

module.exports = { getUser, createUser, getUserId };
