const express = require('express')
const app = express()
const connectDB = require('./config/database')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const bcrypt = require('bcrypt')
const { validateSignUpData } = require('./utils/validation')
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.use(express.json())

app.post("/signup", async (req, res) => {

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


app.post("/login", async (req, res) => {
    try {

        const { emailId, password } = req.body
        const user = await User.findOne({ emailId })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790")

        if (isValidPassword) {
            //Create a JWT Token

            //Add the token to cookie and send the response to the user.
            res.cookie("token", token)
            return res.status(200).json({ message: "Login successful", user })
        } else {
            throw new Error("Invalid password")
        }

    } catch (err) {
        return res.status(500).json({ message: "Error logging in", error: err.message })
    }
})

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

app.get("/profile", async (req, res) => {
    try {
        const cookies = req.cookies
        console.log(cookies)
        const { token } = cookies
        if (!token) {
            throw new Error("Token not found")
        }
        const isTokenValid = await jwt.verify(token, "DEV@Tinder$790")
        if (!isTokenValid) {
            return res.status(401).json({ message: "Unauthorized" })
        }
        const { _id } = isTokenValid
        res.send({ message: "Profile fetched successfully", userId: _id })
    } catch (err) {
        return res.status(500).json({ message: "Error fetching profile", error: err.message })
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
