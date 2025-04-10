const Joi = require("joi");

exports.rentValidation = (data) => {
  const schema = Joi.object({
    product_id: Joi.number().integer().required(),
    renter_id: Joi.number().integer().required(),
    start_date: Joi.date().required(),
    end_date: Joi.date().min(Joi.ref('start_date')).required(),
    total_amount: Joi.number().min(0).required(),
    payment_status: Joi.string().valid('pending', 'paid', 'partial', 'cancelled').default('pending'),
    rent_status: Joi.string().valid('active', 'completed', 'cancelled').default('active'),
    payment_method: Joi.string().valid('cash', 'card', 'bank_transfer').required(),
    notes: Joi.string().max(500).allow(null, ''),
    deposit_amount: Joi.number().min(0).default(0),
    deposit_status: Joi.string().valid('pending', 'returned', 'forfeited').default('pending')
  });

  return schema.validate(data);
}; 