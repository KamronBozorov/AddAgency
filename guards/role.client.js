const jwt = require("jsonwebtoken");

module.exports = function (allowedRoles) {
  return (req, res, next) => {
    const client = req.client;

    if (!client) return res.status(401).send({ message: "Unauthirized" });

    if (!allowedRoles.includes(client.role)) {
      return res.status(403).send({ message: "Access denied" });
    }

    next();
  };
};
