const Joi = require("joi");

exports.contractValidation = (data) => {
  const schema = Joi.object({
    product_id: Joi.number().integer().required(),
    owner_id: Joi.number().integer().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().min(Joi.ref('start_date')).required(),
    total_amount: Joi.number().min(0).required(),
    payment_status: Joi.string().valid('pending', 'paid', 'partial', 'cancelled').default('pending'),
    contract_status: Joi.string().valid('active', 'expired', 'cancelled').default('active'),
    terms_and_conditions: Joi.string().min(3).max(1000).required(),
    payment_method: Joi.string().valid('cash', 'card', 'bank_transfer').required(),
    notes: Joi.string().max(500).allow(null, '')
  });

  return schema.validate(data);
}; 