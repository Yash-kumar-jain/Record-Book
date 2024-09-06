const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const flash = require("connect-flash")
const expressSession = require('express-session');
require('dotenv').config();


const indexRouter = require("./routes/indexRouter");
const hisaabRouter = require("./routes/hisaabRouter");
const db = require('./config/mongoose-conection')

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressSession({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,

}))
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/',indexRouter);
app.use('/hisaab',hisaabRouter);



app.listen(3000);
