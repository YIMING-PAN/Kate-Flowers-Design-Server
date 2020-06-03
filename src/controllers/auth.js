/**
 * Handle user login/refresh token
 */

const User = require("../models/user");
const { formatResponse } = require("../utils/helper");
const { generateToken } = require("../utils/jwt");

const loginUser = async (req, res) => {
  // get email & pwd
  const { email, password } = req.body;

  // check existing
  const existingUser = await User.findOne({ email }).exec();
  if (!existingUser) {
    return formatResponse(res, 404, "Invalid email or password");
  }

  // validate pwd
  if (!(await existingUser.validatePassword(password))) {
    return formatResponse(res, 404, "Invalid email or password");
  }

  // generate token and return success
  const token = generateToken(existingUser.role);

  // return success
  let roleId;
  if (existingUser.role === "customer") {
    roleId = existingUser.customerRole;
  }
  if (existingUser.role === "tradie") {
    roleId = existingUser.tradieRole;
  }
  return formatResponse(res, 200, null, {
    email,
    token,
    userId: existingUser._id,
    role: existingUser.role,
    roleId
  });
};

module.exports = { loginUser };
