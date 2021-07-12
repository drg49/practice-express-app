require("dotenv").config()
const { PORT = 4000 } = process.env

const express = require('express')
const app = express()

const cors = require("cors")

const morgan = require("morgan")

const mongoose = require("./db/connection")

const AuthRouter = require("./controllers/users")
const PostRouter = require("./controllers/post")

app.use(cors());
app.use(express.urlencoded({extended: false}))
app.use(express.json());
app.use(morgan("tiny"))

app.get("/", (req, res) => {
    res.json({
        status: 200,
        msg: "You have hit the default route, and I am just practicing."
    })
})

app.use("/auth", AuthRouter)
app.use("/post", PostRouter)


app.listen(PORT, () => console.log(`Listening on port ${PORT}`))