const Joi = require('joi');
const { password, objectId } = require('./custom.validation');


const creatComment = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object().keys({
      comment: Joi.string().required("Required"),
      reply: Joi.array().default([]),
      userId: Joi.string().required("Required"),
  })
};

module.exports = {
  creatComment,
};
