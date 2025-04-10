const Joi = require("joi");

exports.adminValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('admin', 'superadmin', 'moderator').required(),
    is_active: Joi.boolean().default(true),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).allow(null, ''),
    permissions: Joi.array().items(Joi.string()).default([])
  });

  return schema.validate(data);
}; 