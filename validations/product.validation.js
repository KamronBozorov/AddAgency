const Joi = require("joi");

exports.productValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(1000).required(),
    price: Joi.number().min(0).required(),
    category_id: Joi.number().integer().required(),
    owner_id: Joi.number().integer().required(),
    is_available: Joi.boolean().default(true),
    location: Joi.string().min(3).max(200).required(),
    image_urls: Joi.array().items(Joi.string().uri()).min(1).required(),
    specifications: Joi.object().pattern(Joi.string(), Joi.any()).default({}),
    status: Joi.string().valid('active', 'inactive', 'pending').default('pending')
  });

  return schema.validate(data);
}; 