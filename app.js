// path, For static folders
const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const passport = require('passport')
// Session... So that we can use passport, app.use(passport.session())
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
// Morgan, For login
const morgan = require('morgan')
// const connectDB = require('./config/db')
// express-handlebars, A template engine
const exphbs = require('express-handlebars')
// We are using method override because on a form method can only be post or get so when we want to use update or delete, we have to use the method override package
const methodOverride = require('method-override')
// Load Config
dotenv.config({ path: './config/config.env' })

// Passport Config
require('./config/passport')

// connectDB()
mongoose.connect('mongodb://localhost/test_db')
.then(data => console.log(`Database connected ${data}`))
.catch(err => console.log(err))

const app = express()

// Body Parser..... This is to be able to use req.body to get data or whatever
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Initialize method override
app.use(methodOverride((req, res) => {
    if(req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }   
}))

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Logging in, When a request is made it shows the request on the console.... Not too necessary
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// HandleBars Helpers
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

// Handlebars
app.engine('.hbs', exphbs.engine({ helpers: {formatDate, stripTags, truncate, editIcon, select}, defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', '.hbs')

// sessions
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

// Passport Middlewares
app.use(passport.initialize())
app.use(passport.session())

// Global variables
app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

// Static Folder
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000

app.listen(PORT, console.log(`Server Running on port ${PORT}`))