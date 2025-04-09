const jwt = require("jsonwebtoken")
const User = require("../models/user")
const userAuth = async (req, res, next) => {
    try {
        //Read the cookies from the request
        const { token } = req.cookies
        if (!token) {
            throw new Error("Token not found")
        }
        //Validate the token
        const decodedToken = await jwt.verify(token, "DEV@Tinder$790")
        //Find the user in the database
        const { _id } = decodedToken
        const user = await User.findById({ _id })
        if (!user) {
            throw new Error("User not found")
        }
        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized" })
    }
}

module.exports = { userAuth }