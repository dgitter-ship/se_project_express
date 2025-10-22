const clothingItem = require("../models/clothingItems");
const {
  GOOD_STATUS_CODE,
  CREATE_STATUS_CODE,
  BAD_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require("../utils/errors");

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((item) => {
      res.status(GOOD_STATUS_CODE).send(item);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Server Error" });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(CREATE_STATUS_CODE).res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_STATUS_CODE).send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Server Error" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.status(GOOD_STATUS_CODE).send({ message: "Item Deleted" });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_STATUS_CODE).send({ message: "Bad Request" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Invalid User Id" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Server Error" });
    });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } })
    .orFail()
    .then((item) => {
      res.status(GOOD_STATUS_CODE).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_STATUS_CODE).send({ message: "Bad Request" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Invalid User Id" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Server Error" });
    });
};

const deleteLike = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } })
    .orFail()
    .then((item) => {
      res.status(GOOD_STATUS_CODE).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Server Error" });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  deleteLike,
};
