const express = require("express")
const profileRouter = express.Router()
const { userAuth } = require("../middlewares/auth")
const { validateEditProfileData } = require("../utils/validation")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        res.send({ message: "Profile fetched successfully", req: req.user })
    } catch (err) {
        return res.status(500).json({ message: "Error fetching profile", error: err.message })
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) throw new Error("Invalid Edit Request")
        const { user } = req
        Object.keys(req.body).forEach((key) => user[key] = req.body[key])
        await user.save()
        res.send({ message: "Profile updated successfully", user })
    } catch (err) {
        return res.status(500).json({ message: "Error updating profile", error: err.message })
    }
})
module.exports = profileRouter