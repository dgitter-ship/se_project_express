const router = require("express").Router();
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  deleteLike,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId", deleteItem);
router.delete("/:itemId/likes", deleteLike);

module.exports = router;
