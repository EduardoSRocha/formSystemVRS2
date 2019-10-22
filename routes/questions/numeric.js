const express = require('express'),
      router = express.Router(),
      User = require('../.././models/user'),
      Numeric = require('../.././models/numeric'),
      NumericAnswer = require('../.././models/numericAnswer'),
      middleware = require("../../middleware");
      var {isLoggedIn, globalenvironment} = middleware; // destructuring assignment

//configure flash
const flash = require('connect-flash');
router.use(flash());

/**Configure global variables */
router.use(globalenvironment);

/** Numeric template route*/
router.get('/numeric', (req, res) => {
    //
    res.render("numeric");
  });

/** Numeric question create logic*/
router.post('/numeric', (req, res) => {
//lookup numeric using ID
    User.findById(req.user._id, function(err, user){
    if(err){
        console.log(err);
        res.redirect("/login");
    } else {
    Numeric.create({ expirationDate: req.body.expirationDate, description: req.body.description, title: req.body.title }, function(err, numeric){
        if(!err){
        //add username and id to numeric
        numeric.author.id = user._id;
        numeric.author.username = user.username;
        res.redirect('/numeric/');
        } else {
        console.log(err);
        res.send(err);
        }
    });
    }
}); 
});

/** add option to Numeric question*/
router.post("/addnumeric/:id", function(req, res){
Numeric.findById({_id: req.params.id}, function(err, numeric){
    if(err) 
    {
    console.log(err);
    } 
    else 
    {
    numeric.options.push(req.body.option);
    numeric.save();
    res.json({ success: true });
    }
})
})

/** change title of question */
router.post("/addNumeric/:id", function(req, res){
Numeric.findByIdAndUpdate({_id: req.params.id},{title: req.body.title}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})

/** change title of question */
router.post("/addNumeric/:id", function(req, res){
Numeric.findByIdAndUpdate({_id: req.params.id},{description: req.body.description}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})

/** create answer of multiple questions */
router.post("/numericAnswer/:id", function(req, res) {
NumericAnswer.create({answer: req.body.answer}, function(err, numericAnswer){
    if(!err){
    numericAnswer.question.id = req.params.id;
    numericAnswer.whoAnswered.id = req.user._id;
    numericAnswer.whoAnswered.username = req.user.username;
    numericAnswer.save();
    res.json({ success: true });
    } else {
    console.log(err);
    }
});
})


/** Answers routes */

router.get("/numericAnswer", function(req, res){
Numeric.find({}).populate("_question").populate("_whoAnswered").exec( function(err, answers){
    if(!err) {
    console.log(answers)
    } else { 
    console.log(err)
    }
});
});

//** REPORTS ANSWER */
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
      return next;
    }
    req.flash("success", "Para acessar essa página, por favor, faça login")
    res.redirect("/");
  }
  
module.exports = router;