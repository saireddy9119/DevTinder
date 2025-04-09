const express = require("express")
const profileRouter = express.Router()
const { userAuth } = require("../middlewares/auth")


profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        res.send({ message: "Profile fetched successfully", req: req.user })
    } catch (err) {
        return res.status(500).json({ message: "Error fetching profile", error: err.message })
    }
})
module.exports = profileRouter