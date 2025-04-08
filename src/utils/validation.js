const validator = require("validator")
const validateSignUpData = (data) => {
    const { firstName, lastName, emailId, password } = data.body

    if (!firstName || !lastName) {
        throw new Error("First name and last name are required")
    } else if (firstName.length < 5 || firstName.length > 50) {
        throw new Error("First name should be between 5 and 50 characters")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong enough")
    }
}
module.exports = { validateSignUpData }