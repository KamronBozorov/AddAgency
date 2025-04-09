const Joi = require("joi");

const userFullName = (parent) => {
  return parent.first_name + " " + parent.last_name;
};

exports.userValidation = (body) => {
  const schemaWord = Joi.object({
    username: Joi.string()
      .min(6)
      .message({
        error: "Username kamida 3 ta harifdan iborat bo'lishi kerak!",
      })
      .max(20)
      .message({
        error: "Username eng ko'p 20 ta harifdan iborat bo'lishi kerak!",
      })
      .required()
      .messages({
        "sting.empty": { error: "Username bo'sh bo'lmasligi kerak" },
        "any.required": { error: "Username kiriting" },
      }),
    first_name: Joi.string(),
    last_name: Joi.string(),
    email: Joi.string().email().lowercase(),
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9!$@#]{6,30}$")),
    confirm_password: Joi.ref("password"),
    phone: Joi.string().pattern(new RegExp(/^\+998-\d{2}-\d{3}-\d{2}-\d{2}$/)),
    role: Joi.string().valid("admin", "viewer", "owner"),
    refresh_token: Joi.string(),
    activation_link: Joi.string(),
  });
  return schemaWord.validate(body, { abortEarly: false });
};
