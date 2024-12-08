const { constants } = require("../constants");
const errorHandler = (err, req, res, next) => {
  console.log("I found an error in your code, Dude!")
  let statusCode = res.statusCode || constants.SERVER_ERROR;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.status(statusCode).json({
        title: "Validation Failed",
        message: err.message,
        stackTrace: err.stack
      });
      break;
    case constants.NOT_FOUND:
      res.status(statusCode).json({
        title: "Not Found",
        message: err.message,
        stackTrace: err.stack
      });
      break;
    case constants.UNAUTHORIZED:
        res.status(statusCode).json({
          title: "Un Authorized",
          message: err.message,
          stackTrace: err.stack
        });
        break;
    case constants.FORBIDDEN:
      res.status(statusCode).json({
        title: "Forbidden",
        message: err.message,
        stackTrace: err.stack
      });
      break;  
    case constants.SERVER_ERROR:
      res.status(statusCode).json({
        title: "Server Error",
        message: err.message,
        stackTrace: err.stack
      });
      break;
    default:
      console.log("No error occurred, All good!");
      break;
  }
};

module.exports = errorHandler;