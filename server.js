/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
/* ***********************
 * Routes
 *************************/
app.use(static)
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * typical default file name
 *************************/
/* ***********************
* index
*************************/
app.get("/", function(req, res){
  res.render("index", {title: "Home"})
})


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.use(expressLayouts)
app.set("layout", "layouts/layout") // not at views root


/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
