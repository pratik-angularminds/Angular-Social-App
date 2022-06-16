const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const postController = require("../controllers/posts.controller");
const router = express.Router();
const upload = require("../config/upload");
const postValidation = require("../validations/post.validations");

// Token authentication for all routes defined in this file
router.use(auth());
router
  .route("/")
  .post(upload.array("image"),postController.createPost)
  .get(postController.getAllposts);

router.route("/likes/:id").put(postController.addLikes);
router
  .route("/comment/:id")
  .post(validate(postValidation.creatComment), postController.addComment);
router.route("/reply/:postId").post(postController.postReply);
module.exports = router;
