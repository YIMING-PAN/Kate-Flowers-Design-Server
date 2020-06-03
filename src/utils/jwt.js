const jwt = require("jsonwebtoken");

/**
 *
 * @param {*} payload can be an object that specified user role(auth)
 */
function generateToken(payload) {
  const token = jwt.sign({ payload }, process.env.JWT_KEY, { expiresIn: "1d" });
  return token;
}

/**
 * return null => didn't pass the validation
 * else, return decoded
 * @param {*} token
 */
function validateToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_KEY);
  } catch (e) {
    return null;
  }
  return decoded;
}

module.exports = {
  generateToken,
  validateToken
};
