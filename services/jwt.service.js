const config = require("config");
const jwt = require("jsonwebtoken");

class JWTService {
  constructor(accessKey, accessTime, refreshKey, refreshTime) {
    this.accessKey = accessKey;
    this.accessTime = accessTime;
    this.refreshKey = refreshKey;
    this.refreshTime = refreshTime;
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.accessKey, {
      expiresIn: this.accessTime,
    });
    const refreshToken = jwt.sign(payload, this.refreshKey, {
      expiresIn: this.refreshTime,
    });
    return { accessToken, refreshToken };
  }

  validateAccessToken(token) {
    try {
      return jwt.verify(token, this.accessKey);
    } catch (error) {
      return null;
    }
  }
  validateRefreshToken(token) {
    try {
      return jwt.verify(token, this.refreshKey);
    } catch (error) {
      return null;
    }
  }
}

module.exports = new JWTService(
  config.get("accessKey"),
  config.get("accessTime"),
  config.get("refreshKey"),
  config.get("refreshTime"),
);
