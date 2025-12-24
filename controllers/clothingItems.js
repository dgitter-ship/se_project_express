const clothingItem = require("../models/clothingItems");
const {
  GOOD_STATUS_CODE,
  CREATE_STATUS_CODE,
  BAD_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_CODE,
  FORBIDDEN_STATUS_CODE,
} = require("../utils/errors");

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((item) => {
      res.status(GOOD_STATUS_CODE).send(item);
    })
    .catch(next);
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(CREATE_STATUS_CODE).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BAD_STATUS_CODE("Invalid data"));
        // return res.status(BAD_STATUS_CODE).send({ message: err.message });
      } else {
        next(err);
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR_CODE)
      //   .send({ message: "Server Error" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  clothingItem.findById(itemId).then((item) => {
    if (!item) {
      return res
        .status(NOT_FOUND_STATUS_CODE)
        .send({ message: "Item not found" });
    }
    if (!item.owner.equals(req.user._id)) {
      return res
        .status(FORBIDDEN_STATUS_CODE)
        .send({ message: "Access denied" });
    }
    return clothingItem
      .findByIdAndDelete(itemId)
      .then(() => {
        res.status(GOOD_STATUS_CODE).send({ message: "Item Deleted" });
      })
      .catch((err) => {
        console.error(err);
        if (err.name === "CastError") {
          next(new BAD_STATUS_CODE("Bad request"));
          // return res.status(BAD_STATUS_CODE).send({ message: "Bad Request" });
        }
        if (err.name === "DocumentNotFoundError") {
          next(new NOT_FOUND_STATUS_CODE("Invalid User Id"));
          // return res
          //   .status(NOT_FOUND_STATUS_CODE)
          //   .send({ message: "Invalid User Id" });
        } else {
          next(err);
        }
        // return res
        //   .status(INTERNAL_SERVER_ERROR_CODE)
        //   .send({ message: "Server Error" });
      });
  });
};

const likeItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findByIdAndUpdate(itemId, { $addToSet: { likes: userId } }, { new: true })
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }
      return res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BAD_STATUS_CODE("Bad Request"));
        // return res.status(BAD_STATUS_CODE).send({ message: "Bad Request" });
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NOT_FOUND_STATUS_CODE("Invalid User Id"));
        // return res
        //   .status(NOT_FOUND_STATUS_CODE)
        //   .send({ message: "Invalid User Id" });
      } else {
        next(err);
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR_CODE)
      //   .send({ message: "Server Error" });
    });
};

const deleteLike = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findByIdAndUpdate(itemId, { $pull: { likes: userId } }, { new: true })
    .then((item) => {
      if (!item) {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }
      return res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BAD_STATUS_CODE("Bad Request"));
        // return res.status(BAD_STATUS_CODE).send({ message: "Bad Request" });
      }
      if (err.name === "DocumentNotFoundError") {
        next(new NOT_FOUND_STATUS_CODE("Invalid User Id"));
        // return res.status(NOT_FOUND_STATUS_CODE).send({ message: "Not Found" });
      } else {
        next(err);
      }
      // return res
      //   .status(INTERNAL_SERVER_ERROR_CODE)
      //   .send({ message: "Server Error" });
    });
};

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  deleteLike,
};
