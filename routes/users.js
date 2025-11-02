const router = require("express").Router();
const {
  getUser,
  createUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/user");

router.get("/", getUser);
router.post("/", createUser);
router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
