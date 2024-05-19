const tasks = require('../routes/tasks')

const users = require('../routes/users')
const auth = require('../routes/auth')
const error = require('../middlewares/errorMiddleware')
const express = require('express')

module.exports = function(app){
    app.use(express.json()) //accept json request
    app.use(express.urlencoded({extended:true})) //accept key/value pairs in requests
    app.use('/api/tasks',tasks)
    app.use('/api/users',users)
    app.use('/api/auth',auth)
    app.use(error)
}