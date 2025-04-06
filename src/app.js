const express = require('express')
const app = express()
const connectDB = require('./config/database')

connectDB().then(() => {
    console.log("MongoDB connected successfully")
    app.listen(3000, () => {
        console.log('server started on port 3000')
    })
}).catch((err) => {
    console.error("MongoDB connection failed", err.message)
})
