const clothingItem = require("../models/clothingItems");
const {
  goodStatusCode,
  createStatusCode,
  badStatusCode,
  notFoundStatusCode,
  internalServerErrorCode,
} = require("../utils/errors");

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((item) => {
      res.status(goodStatusCode).send(item);
    })
    .catch((err) => {
      console.error(err);
      return res.status(internalServerErrorCode).send({ message: err.message });
    });
};

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  clothingItem
    .create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      return res.status(internalServerErrorCode).send({ message: err.message });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  clothingItem
    .findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => {
      res.status(goodStatusCode).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      return res.status(internalServerErrorCode).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      res.status(createStatusCode).send({});
    })
    .catch((err) => {
      console.error(err);
      return res.status(internalServerErrorCode).send({ message: err.message });
    });
};

module.exports = { getItems, createItem, updateItem, deleteItem };
