const express = require('express'),
      router = express.Router(),
      User = require('../.././models/user'),
      SelectionBox = require('../.././models/selectionBox'),
      SelectionBoxAnswer = require('../.././models/selectionBoxAnswer'),
      middleware = require("../../middleware");
      var {isLoggedIn, globalenvironment} = middleware; // destructuring assignment


//configure flash
const flash = require('connect-flash')
router.use(flash());

/**Configure global variables */
router.use(globalenvironment);

/** Selection Box template route*/
router.get('/selectionBox', (req, res) => {
    //
    res.render("selectionBox");
  });

/** Selection Box question create logic*/
router.post('/selectionBox', (req, res) => {
//lookup selectionBox using ID
    User.findById(req.user._id, function(err, user){
    if(err){
        console.log(err);
        res.redirect("/login");
    } else {
    SelectionBox.create({ expirationDate: req.body.expirationDate, description: req.body.description, title: req.body.title }, function(err, selectionBox){
        if(!err){
        //add username and id to selectionBox
        selectionBox.author.id = user._id;
        selectionBox.author.username = user.username;
        //add options one by one
        req.body.options.forEach(option => {
            selectionBox.options.push(option);
        });
        selectionBox.save();
        res.redirect('/selectionBox/');
        } else {
        console.log(err);
        res.send(err);
        }
    });
    }
}); 
});

/** add option to Selection Box question*/
router.post("/addselectionBox/:id", function(req, res){
SelectionBox.findById({_id: req.params.id}, function(err, selectionBox){
    if(err) 
    {
    console.log(err);
    } 
    else 
    {
    selectionBox.options.push(req.body.option);
    selectionBox.save();
    res.json({ success: true });
    }
})
})

/** change title of question */
router.post("/addSelectionBox/:id", function(req, res){
SelectionBox.findByIdAndUpdate({_id: req.params.id},{title: req.body.title}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})

/** change title of question */
router.post("/addSelectionBox/:id", function(req, res){
SelectionBox.findByIdAndUpdate({_id: req.params.id},{description: req.body.description}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})

/** create answer of multiple questions */
router.post("/selectionBoxAnswer/:id", function(req, res) {
SelectionBoxAnswer.create({answer: req.body.answer}, function(err, selectionBoxAnswer){
        if(!err){
            selectionBoxAnswer.question.id = req.params.id;
            selectionBoxAnswer.whoAnswered.id = req.user._id;
            selectionBoxAnswer.whoAnswered.username = req.user.username;
            selectionBoxAnswer.save();
            res.json({ success: true });
        } else {
            console.log(err);
        }
    });
})

/** Answers routes */
router.get("/selectionBoxAnswer", function(req, res){
SelectionBox.find({}).populate("_question").populate("_whoAnswered").exec( function(err, answers){
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