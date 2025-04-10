const Joi = require("joi");

exports.categoryValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).max(500).required(),
    parent_category_id: Joi.number().integer().min(0).allow(null),
    is_active: Joi.boolean().default(true),
    image_url: Joi.string().uri().allow(null, ''),
    order: Joi.number().integer().min(0).default(0)
  });

  return schema.validate(data);
}; 