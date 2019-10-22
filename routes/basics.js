/** application configuration */
const express = require('express'),
      bodyParser = require("body-parser"), 
      methodOverride = require('method-override'), 
      passport = require('passport'), 
      LocalStrategy = require("passport-local"),
      User = require('../models/user'),
      router = express.Router();
      
/** bodyparser configuration */
router.use(bodyParser.urlencoded({extended: true}));
                          
/** HTTP methods configuration */
router.use(methodOverride("_method"));

//configure flash
const flash = require('connect-flash');
router.use(flash());

/** set passport local*/
router.use(require("express-session")({
  secret: "formSystem",
  resave: false,
  saveUninitialized: false
}))

router.use(passport.initialize());
router.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
  
module.exports = router;