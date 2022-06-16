const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const { postService } = require("../services");
const catchAsync = require('../utils/catchAsync');
const {
  userService
} = require('../services');
const { profile } = require('../config/logger');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser({
    ...req.body
  });
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await userService.queryUsers(filter, {
    ...options
  });
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await (await userService.getUserById(req.params.userId))
    .populate("_id name email");
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(req.user);
});

const updateUser = catchAsync(async (req, res) => {
  let user;
  if(req.file)
   user = await (await userService.updateUserById(req.params.userId, {...req.body,profile:req.file.filename}))
  else
   user = await (await userService.updateUserById(req.params.userId, req.body))

  res.send(user);
});

const updateOrg = catchAsync(async (req, res) => {
  const org = await userService.updateOrgById(req.params.orgId, req.body);
  res.send(org);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const savePost = (async(req, res) => {
  try{
    let post = await postService.getPost(req.body.postId);
    if(post){
      const user = await userService.savedPost(req.params.id, req.body.postId);
    res.send(user);
  }
  else{
    res.status(404).send("Post Not Found")
  }

}catch (err){
  res.send(err);
}
})

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateOrg,
  savePost,
};
