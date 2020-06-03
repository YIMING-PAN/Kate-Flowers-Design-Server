/**
 * Joi schema to validate models
 *  - added to router (before the controller method)
 */
const Joi = require("joi");
const { formatResponse } = require("../utils/helper");

function validate(req) {
  const schema = {
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required(),
    username: Joi.string()
      .min(3)
      .required(),
    role: Joi.string(),
    roleId: Joi.string()
  };

  return Joi.validate(req, schema);
}

module.exports = (req, res, next) => {
  const { error } = validate(req.body);
  if (error) {
    return formatResponse(res, 400, error.details[0].message, null);
  }
  return next();
};
