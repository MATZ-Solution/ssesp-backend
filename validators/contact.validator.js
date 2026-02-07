const Joi = require("joi");
const sanitize = require("../utils/sanitize");

exports.addContactSchema = Joi.object({

  name: Joi.string().min(2).max(50).custom(sanitize),

  email: Joi.string().email().lowercase(),

  contactNumber: Joi.string()
    .pattern(/^\+?[0-9]{7,15}$/),

  designation: Joi.string().allow("").custom(sanitize),

  address: Joi.string().allow("").custom(sanitize),

  city: Joi.string().allow("").custom(sanitize),

  country: Joi.string().allow("").custom(sanitize),

  website: Joi.string().uri().allow(""),

  linkedInProfile: Joi.string().uri().allow(""),
});