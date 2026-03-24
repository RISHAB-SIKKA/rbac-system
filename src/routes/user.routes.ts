import authMiddleware = require("../middleware/auth.middleware");
import permissionMiddleware = require("../middleware/permission.middleware");
import express = require("express");
import userControllerModule = require("../controllers/user.controller");

const userRouter = express.Router();


userRouter.delete(
  "/post",
  authMiddleware,
  permissionMiddleware("DELETE_POST"),
  (req, res) => {
    res.json({ message: "Post deleted successfully" });
  },
);

export = { userRouter };