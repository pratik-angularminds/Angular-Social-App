const httpStatus = require("http-status");
const { posts, Comments,reply } = require("../models");
const  {}  =require("../models");
const { findByIdAndUpdate } = require("../models/comment");
const createPost = async (postbody) => {
  const p = new posts(postbody);
     const saveduser = await p.save();
     return saveduser;
};

const getPosts = async (filter, options) => {
  console.log(filter,options)
  const p = await posts.paginate(filter, options);
  return p;
};

const postLikes=async(postid,like)=>{
const updates = await posts.updateOne(
  { _id: postid },
  { $set: { likes: like } }
);
return updates;
}

const getPost = async (id)=>{
    const post=await posts.findById(id);
    return post;
}

const getPostByid = async (id) => {
  return posts.findById(id);
};

const updateByid = async (postid,comment)=>{
  const post = await getPostByid(postid);
  if (!post) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Post not found");
  }
  const p = new Comments(comment);
  const savep = await p.save();
post.comments.push(savep);
  Object.assign(post, post);
  await post.save();
  return post;
}

const postReply=async(postId,replys)=>{
const post=await getPostByid(postId);
 if (!post) {
   throw new ApiError(httpStatus.BAD_REQUEST, "Post not found");
 }
 let p=post;
   const r=new reply(replys);
   const savep = await r.save();
   console.log(post);
   p.comments.map((c) => (c._id.equals(replys.commentId) ? c.reply.push(savep) : ""));
   Object.assign(post, p);
    const get = posts.updateOne({_id:postId}, { $set: { ...post} });
return get;
}

module.exports = {
  createPost,
  getPosts,
  postLikes,
  getPost,
  updateByid,
  postReply,
};
