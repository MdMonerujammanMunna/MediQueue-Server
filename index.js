const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const app = express()
dotenv.config()
const PORT = process.env.PORT
app.use(cors()) // cors add 
app.use(express.json())
app.get('/', (req, res) => {
    res.send("I am fine you do your work")
})

app.listen(PORT, () => {
    console.log(`hello on ${PORT}`)
})