const logger = require("../../config/logger");
const { formatResponse } = require("../utils/helper");

module.exports = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    logger.error(err.message);
    return formatResponse(res, 400, err.message, null);
  }
  if (err.name === "CastError") {
    const splitedStr = err.message.split(" ");
    const errModel = splitedStr[splitedStr.length - 1];
    if (errModel === '"User"')
      return formatResponse(
        res,
        400,
        "Invalid user id, Please login again",
        null
      );
  }
  return formatResponse(res, 500, "Something unexpected happened");
};
