const Joi = require("joi");

exports.loginSchema = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().email().required(),
});

exports.addUserSchema = Joi.object({
  name: Joi.string().required(),
  role: Joi.string().required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().email().required(),
});

// module.exports = { loginSchema, registerSchema };
