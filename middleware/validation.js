const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

module.exports.validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "imageUrl" field must be filled in',
      "string.uri": 'the "imageUrl" field must be a valid url',
    }),
  }),
});

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),

    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),

    email: Joi.string().required().email().messages({
      "string.empty": 'the "email" field must be filled in',
    }),

    password: Joi.string().required().min(8).messages({
      "string.empty": 'the "password" field must be filled in',
    }),
  }),
});

module.exports.validateUserAuthentication = celebrate({
  body: Joi.object.keys({
    email: Joi.string().required().email().messages({
      "string.empty": 'The "email" field must be filled in',
    }),

    password: Joi.string()
      .required()
      .min(8)
      .messages({ "string.empty": 'The "email" field must be filled in' }),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object.keys({
    userId: Joi.string().alphanum().length(24).messages({
      "string.length": "ID must be exactly 24 characters",
      "string.alphanum": "ID must contain only letters and numbers",
    }),
  }),
});

module.exports.validateItemId = celebrate({
  params: Joi.object.keys({
    itemId: Joi.string().alphanum().length(24).messages({
      "string.length": "ID must be exactly 24 characters",
      "string.alphanum": "ID must contain only letters and numbers",
    }),
  }),
});
