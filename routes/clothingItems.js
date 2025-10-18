const router = require("express").Router();
const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.put("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
