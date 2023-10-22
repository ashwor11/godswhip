//packages
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

//Middlewares
const {requireAuth, checkUser} = require('./middlewares/authMiddleware')

//Modules
const User = require("./models/users");
const userRoute = require('./routes/userRoute')
const entryRoute = require('./routes/entryRoute')
const topicRoute = require('./routes/topicRoute')
const indexRoute = require('./routes/indexRoute')







require('dotenv').config();



console.log(process.env.C)

const app = express();

const dbURL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 80
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true,})
    .then((result)=>{app.listen(PORT)})
    .catch((err)=>{console.log(err)})

app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))

app.set('view engine', 'ejs')

app.use(morgan('tiny'))
app.use(cookieParser())
app.use('*', checkUser)


app.use('/', indexRoute)
app.use('/user', userRoute)
app.use('/entry', entryRoute)
app.use('/topic', topicRoute)

