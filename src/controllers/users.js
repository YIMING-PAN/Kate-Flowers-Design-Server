const User = require("../models/user");
const { generateToken } = require("../utils/jwt");
const { formatResponse } = require("../utils/helper");

async function checkEmailExist(req, res) {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return formatResponse(res, 400, "email already existed");
  }
  return formatResponse(res, 200, null, true);
}

/**
 * Register controller
 *    - if there is no email/phone validation after user registered,
 *      directly return token;
 *    - else, do not return token ==> instead login controller will return it
 */
async function addUser(req, res) {
  const { email, password, username, role, roleId } = req.body;

  // check existed email
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return formatResponse(res, 400, "email already existed", null);
  }

  let newUser;

  switch (role) {
    case "customer":
      newUser = new User({
        email,
        password,
        username,
        role,
        customerRole: roleId
      });
      break;
    case "tradie":
      newUser = new User({
        email,
        password,
        username,
        role,
        tradieRole: roleId
      });
      break;
    default:
      return formatResponse(res, 401, "Role type undefined", null);
  }

  // hash plain pwd and save
  await newUser.hashPassword();

  await newUser.save();
  // generate token and return
  const token = generateToken(newUser.role);
  const userId = newUser._id;
  return formatResponse(res, 201, "Successfully registered", {
    email,
    token,
    userId,
    role,
    roleId
  });
}

module.exports = { checkEmailExist, addUser };
