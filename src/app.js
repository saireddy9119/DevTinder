const express = require('express')
const app = express()
const connectDB = require('./config/database')
const User = require('./models/user')
app.use(express.json())

app.post("/signup", async (req, res) => {
    // const userObj = {
    //     firstName: "Sai",
    //     lastName: "Reddy",
    //     emailId: "sai@gmail.com",
    //     password: "123456",
    //     age: 22,
    //     gender: "Male"
    // }
    //Creating a new instance of the User model
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({ message: "User created successfully" })
    } catch (err) {
        return res.status(500).json({ message: "Error creating user", error: err.message })
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
