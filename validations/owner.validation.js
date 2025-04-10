const Joi = require("joi");

exports.ownerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    password: Joi.string().min(6).required(),
    company_name: Joi.string().min(3).max(100).allow(null, ''),
    address: Joi.string().min(3).max(200).required(),
    is_verified: Joi.boolean().default(false),
    status: Joi.string().valid('active', 'inactive', 'pending').default('pending')
  });

  return schema.validate(data);
}; 