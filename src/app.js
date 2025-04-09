const express = require('express')
const app = express()
const connectDB = require('./config/database')
const User = require('./models/user')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json())

const authRouter = require('./routers/auth')
const profileRouter = require('./routers/profile')
const requestsRouter = require('./routers/requests')

app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestsRouter)



app.get("/user", async (req, res) => {
    const emailId = req.body.emailId
    try {
        const user = await User.find({ emailId })
        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" })
        } else {
            return res.status(200).json({ message: "User fetched successfully", user })
        }

    } catch (err) {
        return res.status(500).json({ message: "Error fetching user", error: err.message })
    }
})

app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({})
        if (users.length === 0) {
            return res.status(404).json({ message: "No users found" })
        } else {
            return res.status(200).json({ message: "Users fetched successfully", users })
        }
    } catch (err) {
        return res.status(500).json({ message: "Error fetching users", error: err.message })
    }

})



app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete({ _id: userId })
    } catch (err) {
        res.status(500).send({ message: "Something went wrong", error: err.message })
    }
})

app.patch("/user/:userId", async (req, res) => {


    try {
        const userId = req.params?.userId
        const data = req.body
        const ALLOWED_UPDATES = ["photoUrl", "gender", "about", "age", "skills"];
        const isUpdateAllowed = Object.keys(data).every((update) => ALLOWED_UPDATES.includes(update));
        if (!isUpdateAllowed) {
            throw new Error("Invalid update")
        }
        if (data?.skills.length > 10) {
            throw new Error("Skills length should not be more than 10")
        }
        await User.findByIdAndUpdate({ _id: userId }, data, { runValidators: true })
        res.status(200).send({ message: "User updated successfully" })
    } catch (err) {
        res.status(500).send({ message: "Something went wrong", error: err.message })
    }
})


connectDB().then(() => {
    console.log("MongoDB connected successfully")
    app.listen(3000, () => {
        console.log('server started on port 3000')
    })
}).catch((err) => {
    console.error("MongoDB connection failed", err.message)
})
