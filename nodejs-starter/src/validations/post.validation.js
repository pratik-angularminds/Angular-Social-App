const Joi = require("joi");
// const { password, objectId } = require("./custom.validation");

const createPost = {
  body: Joi.object().keys({
    image: Joi.string().required(),
    title: Joi.string().required(),
    path: Joi.string().required(),
    userId: Joi.string().required(),
    userName: Joi.string().required(),
  }),
};
 