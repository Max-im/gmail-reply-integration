const Validator = require("validator");
const isEmpty = require("./isEmpty");

module.exports = function emailValidation(emailArr) {
  let errors = {};

  emailArr.forEach(email => {
    const emailForCheck = !isEmpty(email) ? email : "";

    // EMAIL CHECK
    if (!emailForCheck.match(/\w+@\w+/)) {
      errors.email = `Email ${emailForCheck} is not valid`;
    }
    if (Validator.isEmpty(emailForCheck)) {
      errors.email = "Email field is required";
    }
  });

  return { errors, isValid: isEmpty(errors) };
};
