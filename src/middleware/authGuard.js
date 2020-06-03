const { validateToken } = require("../utils/jwt");
const { formatResponse } = require("../utils/helper");

/**
 * Authorization Guard
 *      - verify if the user carried valid token
 *        (from Header -Authorization)
 */
module.exports = (req, res, next) => {
  // get auth from header
  const authHeader = req.header("Authorization");
  // check exist
  if (!authHeader) return formatResponse(res, 401, "Access denied", null);

  // check format - jwt: type should be 'Bearer'
  const contentArr = authHeader.split(" ");
  if (contentArr.length !== 2 || contentArr[0] !== "Bearer") {
    return formatResponse(res, 401, "Access denied", null);
  }

  // validate token
  const decoded = validateToken(contentArr[1]);

  // success => put decoded in res.user
  if (decoded) {
    res.user = decoded;
    return next();
  }
  return formatResponse(res, 401, "Access denied", null);
};
