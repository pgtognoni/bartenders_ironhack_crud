// ℹ️ Gets access to environment variables/settings

// https://www.npmjs.com/package/dotenv
require('dotenv').config()

// ℹ️ Connects to the database
require('./db')

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require('express')

const app = express()

//bodyparser
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require('./config')(app)
require('./config/session')(app)

// default value for title local
const capitalize = require('./utils/capitalize')
const projectName = 'bartender_crud'

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`

// 👇 Start handling routes here
const indexRoutes = require('./routes/index.routes')
app.use('/', indexRoutes)

//Authentication route for user
const authUser = require('./routes/auth/user');
app.use('/user', authUser);

const cocktailRoutes = require('./routes/auth/cocktail')
app.use('/cocktail', cocktailRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app)

module.exports = app
