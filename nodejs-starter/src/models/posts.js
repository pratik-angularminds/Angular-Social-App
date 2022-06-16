const mongoose = require("mongoose");
const { private, paginate, softDelete } = require("./plugins");
const postschema = new mongoose.Schema({
  image: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true,
    min: 1,
  },
  location:{
    type:String,
    default:""
  },
  path: {
    type: String,
    required: true,
    min: 1,
  },
  likes: {
    type: Array,
    default: [],
  },
  comments: {
    type: Array,
    default: [],
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  }, 
},
{
    timestamps: true,
  }
);

postschema.plugin(softDelete);
postschema.plugin(private);
postschema.plugin(paginate);
module.exports = mongoose.model("post", postschema);
