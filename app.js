require('dotenv').config();
const express = require("express")
const server = express()
const morgan = require('morgan');
const cors = require('cors')

server.use(morgan('dev'));
server.use(cors())
server.use(express.json())

server.use((req, res, next) => {
    console.log("<____Body Logger START____>")
    console.log(req.body)
    console.log("<_____Body Logger END_____>")

    next()
})





const apiRouter = require("./api")
server.use("/api", apiRouter)
const client = require('./db/client');
client.connect()

module.exports = server