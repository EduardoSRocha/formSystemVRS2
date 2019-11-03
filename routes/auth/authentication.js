const express = require('express'), 
      router = express.Router(),
      bodyParser = require("body-parser"),
      flash = require("connect-flash"),
      methodOverride = require('method-override'), 
      passport = require('passport'), 
      LocalStrategy = require("passport-local"),
      User = require('../.././models/user'),
      middleware = require("../../middleware");
      var {isLoggedIn, globalenvironment} = middleware; // destructuring assignment

/** bodyparser configuration */
router.use(bodyParser.urlencoded({extended: true}));

//configure flash
router.use(flash());

/**Configure global variables */
router.use(globalenvironment);

/** HTTP methods configuration */
router.use(methodOverride("_method"));

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

router.get('/resetPassword', (req, res) => {
    res.render('resetPassword')
  });
  
/** Auth Routes */
router.post('/register', function(req, res){
  var now = new Date(Date.now());
  var bday = new Date(req.body.bday);
  var age = now.getYear() - bday.getYear();

  User.register(new User({username: req.body.username, email: req.body.username, bday: new Date(req.body.bday)}), req.body.password, function(err, user){     
    if(err){
      console.log(err);
      return res.render("register", {'error': err.message});
    }
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
      res.redirect('home');
    });
  })
})



/** Login Routes */
router.get('/login', (req, res) => {
  res.render("login");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/perfil",
  failureRedirect: "/login",
  failureFlash: true,
  successFlash: 'Bem Vindo ao FSystem!'
}), function(req, res){
});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})

module.exports = router;