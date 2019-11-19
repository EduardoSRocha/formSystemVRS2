/** application configuration */
const mongoose = require('mongoose'), 
      express = require('express'),
      app = express(),
      flash = require("connect-flash") 
      bodyParser = require("body-parser"), 
      seoConfigs = require("./middleware/seoConfigs"), 
      path = require('path'), 
      methodOverride = require('method-override'), 
      passport = require('passport'), 
      LocalStrategy = require("passport-local"),
      User = require('./models/user'),
      middlewareRoutes = require('./routes/middlewareRoutes'),
      dotenv = require('dotenv'),
      middlewareRoutes = require('./routes/middlewareRoutes');
      middleware = require("./middleware");
    var {isLoggedIn, globalenvironment} = middleware; // destructuring assignment

//configure dotenv
dotenv.config();

//configure routes
app.use(middlewareRoutes);

//configure flash
app.use(flash());
app.use(globalenvironment);

/** engine to config for dynamic pages */
app.set("view engine", "ejs");

/**Seo Configuration */
seoConfigs(app)

/** assign mongoose promise library and connect to database */
mongoose.Promise = global.Promise;
const databaseUri = process.env.MDBA_KEY;
console.log(databaseUri)
//const databaseUri = process.env.MDBA_KEY || process.env.MDBL_KEY;
mongoose.connect(databaseUri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(() => console.log(`Database connected`))
.catch(err => console.log(`Database connection error: ${err.message}`));

/** bodyparser configuration */
app.use(bodyParser.urlencoded({extended: true}));

/** require moment*/
app.locals.moment = require('moment');

/**Set proxy */
app.set('trust proxy', 1);

/** configuring web page css and js files */
app.use('/img', express.static(__dirname + '/public/img'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));

app.all('*', function(req, res) {
  if(!req.user){
      req.flash('error', 'Usuário não autenticado');
      res.render('login');
  } else {
      req.flash('error', '404 - page not found');
      res.render('home');
  }
});

/** Dev Test */
if (module === require.main) {
  const server = app.listen(process.env.PORT, () => {
    const port = server.address().port;
    console.log(`App listening on port ${port}`);
  });
}