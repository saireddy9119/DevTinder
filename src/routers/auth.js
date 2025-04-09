const express = require("express")
const router = express.Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")
const { validateSignUpData } = require("../utils/validation")
router.post("/signup", async (req, res) => {

    try {
        validateSignUpData(req)
        const { password, firstName, lastName, emailId } = req.body
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        })
        await user.save()
        return res.status(200).json({ message: "User created successfully" })
    } catch (err) {
        return res.status(500).json({ message: "Error creating user", error: err.message })
    }

})

router.post("/login", async (req, res) => {
    try {

        const { emailId, password } = req.body
        const user = await User.findOne({ emailId })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const isValidPassword = await user.validatePassword(password)


        if (isValidPassword) {
            //Create a JWT Token
            const token = await user.getJWT()
            //Add the token to cookie and send the response to the user.
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) })//cookie expires in 8 hours
            return res.status(200).json({ message: "Login successful", user })
        } else {
            throw new Error("Invalid password")
        }

    } catch (err) {
        return res.status(500).json({ message: "Error logging in", error: err.message })
    }
})
module.exports = router