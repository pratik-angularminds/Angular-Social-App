const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { postService } = require("../services");
const pick = require("../utils/pick");

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost({
    ...req.body,
    image: req.files.map((file) => file.filename),
    path: req.files[0].destination,
  });                            
  try {
    const savedpost = await post.save();
    res.send(savedpost);
  } catch (err) {
    res.status(400).send(err);
  }
});

const getAllposts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const getposts = await postService.getPosts(filter, { ...options });
  res.send(getposts);
});

const addLikes = catchAsync(async (req, res) => {
  try {
    let likes = await postService.getPost(req.body.postId);
    let l = likes.likes;
    let msg;
    if (!likes.likes.includes(req.params.id)) {
      l.push(req.params.id);
      msg = "Like Added SuccessFully!!!";
    } else {
      l = likes.likes.filter((d) => d !== req.params.id);
      msg = "Like Removed SuccessFully!!!";
    }
    const getslikes = postService.postLikes(req.body.postId, l);
    res.send(msg);
  } catch (err) {
    res.send(err);
  }
});

const postReply =catchAsync(async (req, res) => {
let repl=await postService.postReply(req.params.postId,req.body);
res.send(repl);
})

const addComment = catchAsync(async (req, res) => {
  let post = await postService.updateByid(req.params.id, req.body);
  res.send(post);
});

module.exports = {
  createPost,
  getAllposts,
  addLikes,
  addComment,
  postReply,
};
