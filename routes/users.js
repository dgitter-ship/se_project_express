const router = require("express").Router();
const { getUser, createUser, getUserId } = require("../controllers/user");

// router.get("/", getUser);
// router.post("/", createUser);
router.get("/:userId", getUserId);

module.exports = router;
