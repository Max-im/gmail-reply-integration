const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function registerValidation(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  // EMAIL CHECK
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (!data.email.match(/@idealscorp\.com/g)) {
    errors.email = "Email must ends on @idealscorp.com";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  // PASSWORD CHECK
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = "Password must be at least 6 characters";
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  // PASSWORD-2 CHECK
  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = "Passwords must match";
  }
  if (Validator.isEmpty(data.password2)) {
    errors.password2 = "Confirm Password field is required";
  }

  return { errors, isValid: isEmpty(errors) };
};
