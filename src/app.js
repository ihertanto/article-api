const express = require('express')
require('./db/mongoose')
const authRouter = require('./routers/auth')
const userRouter = require('./routers/user')
const articleRouter = require('./routers/article')

const app = express()

app.use(express.json())
app.use(authRouter)
app.use(userRouter)
app.use(articleRouter)

module.exports = app