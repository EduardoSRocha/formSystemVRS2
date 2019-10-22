const express = require('express'),
      router = express.Router(),
      User = require('../.././models/user'),
      LongText = require('../.././models/longText'),
      LongTextAnswer = require('../.././models/longTextAnswer'),
      middleware = require("../../middleware");
      var {isLoggedIn, globalenvironment} = middleware; // destructuring assignment


//configure flash
const flash = require('connect-flash');
router.use(flash());

/**Configure global variables */
router.use(globalenvironment);

/** LongText template route*/
router.get('/longText', (req, res) => {
    //
    res.render("longText");
  });

/** LongText question create logic*/
router.post('/longText', (req, res) => {
//lookup longText using ID
    User.findById(req.user._id, function(err, user){
    if(err){
        console.log(err);
        res.redirect("/login");
    } else {
    LongText.create({ expirationDate: req.body.expirationDate, description: req.body.description, title: req.body.title }, function(err, longText){
        if(!err){
        //add username and id to longText
        longText.author.id = user._id;
        longText.author.username = user.username;
        longText.save();
        res.redirect('/longText');
        } else {
        console.log(err);
        res.send(err);
        }
    });
    }
}); 
});

/** change title of question */
router.post("/addLongText/:id", function(req, res){
LongText.findByIdAndUpdate({_id: req.params.id},{title: req.body.title}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})

/** change title of question */
router.post("/addLongText/:id", function(req, res){
LongText.findByIdAndUpdate({_id: req.params.id},{description: req.body.description}, function(err){
        if(err){
            console.log(err);
        } else {
            res.json({
                success: true
            });
        }
    })
})

/** create answer of multiple questions */
router.post("/longTextAnswer/:id", function(req, res) {
LongTextAnswer.create({answer: req.body.answer}, function(err, longTextAnswer){
    if(!err){
    longTextAnswer.question.id = req.params.id;
    longTextAnswer.whoAnswered.id = req.user._id;
    longTextAnswer.whoAnswered.username = req.user.username;
    longTextAnswer.save();
    res.json({ success: true });
    } else {
    console.log(err);
    }
});
})


/** Answers routes */

router.get("/longTextAnswer", function(req, res){
LongText.find({}).populate("_question").populate("_whoAnswered").exec( function(err, answers){
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