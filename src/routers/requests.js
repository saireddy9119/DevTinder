const express = require("express")
const requestsRouter = express.Router()
const { userAuth } = require("../middlewares/auth")


requestsRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const { user } = req
})
module.exports = requestsRouter