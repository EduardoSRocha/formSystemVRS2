const express = require('express'),
      router = express.Router(),
      User = require('../.././models/user'),
      Question = require('../.././models/question'),
      Answer = require('../../models/answer'),
      middleware = require("../../middleware");
      var {isLoggedIn, globalenvironment} = middleware; // destructuring assignment

//configure flash
const flash = require('connect-flash');
router.use(flash());

/**Configure global variables */
router.use(globalenvironment);

/** multiple Choice question create logic*/
router.post('/multipleChoice', (req, res) => {
//lookup question using ID
    User.findById(req.user._id, function(err, user){
    if(err){
        console.log(err);
        res.redirect("/login");
    } else {
        //postgress expirationDate: req.body.expirationDate, description: req.body.description, title: req.body.title 
        //mongo
    Question.create({ expirationDate: req.body.expirationDate, description: req.body.description, title: req.body.title, type: "multiplechoice", creationDate: Date.now() }, function(err, question){
        if(!err){
        //add username and id to question
        question.author.id = user._id;
        question.author.username = user.username;
        //add options one by one
        req.body.options.forEach(option => {
            question.optionsText.push(option);
        });
        question.save();
        res.redirect('/home');
        } else {
        console.log(err);
        res.send(err);
        }
    });
    }
}); 
});

/** add option to multiple Choice question*/
router.post("/addquestion/:id", function(req, res){
Question.findById({_id: req.params.id}, function(err, question){
    if(err) 
    {
    console.log(err);
    } 
    else 
    {
    question.optionsText.push(req.body.option);
    question.save();
    res.json({ success: true });
    }
})
})

/** change title of question */
router.post("/updateQuestion/changeTitle/:id", function(req, res){
Question.findByIdAndUpdate({_id: req.params.id},{title: req.body.title}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})

/** change title of description */
router.post("/updateQuestion/changeDescription/:id", function(req, res){
Question.findByIdAndUpdate({_id: req.params.id},{description: req.body.description}, function(err){
    if(err){
        console.log(err);
    } else {
        res.json({ success: true });
    }
    })
})
/** change title of expirationDate */
router.post("/addQuestion/changeExpirationDate/:id", function(req, res){
    Question.findByIdAndUpdate({_id: req.params.id},{expirationDate: req.body.expirationDate}, function(err){
        if(err){
            console.log(err);
        } else {
            res.json({ success: true });
        }
        })
    })

/** create answer of multiple questions */
router.post("/multipleChoiceAnswer/:id", function(req, res) {
    Answer.create({answerString: req.body.answerString}, function(err, answer){
        Question.findOneAndUpdate({"_id": req.params.id}, {$inc:{quantAnswers: 1}}, {new: true}).then(async function(a){
            await a.whoAnswered.push(String(req.user._id));
            await a.save();
            return a;
        }).then(async function(a){
            answer.question.id = req.params.id;
            answer.question.title = a.title;
            answer.question._id = a._id;
            answer.whoAnswered.id = req.user._id;
            answer.whoAnswered.username = req.user.username;
            await answer.save();
            res.redirect('/home');
        })
    });
})


/** Answers routes */

router.get("/answer", function(req, res){
Question.find({}).populate("_question").populate("_whoAnswered").exec( function(err, answers){
    if(!err) {
    console.log(answers)
    } else { 
    console.log(err)
    }
});
});

async function randomUser(){
  let ArrayUsers = new Array();
  User.find({}).then(async function(users){
    let indice = Math.floor(Math.random()*users.length);
    users.forEach(user => {
      let userData = new Object();
      userData.id = JSON.stringify(user._id);
      userData.username = JSON.stringify(user.username);
      ArrayUsers.push(userData);
    });
    return ArrayUsers[indice];
  })
}

Question.create({
  expirationDate: "12-12-2019",
  description: "Olá Mundo",
  title: "Automatic Question - O queijo derrete mais quando..",
  type: "multiplechoice", creationDate: Date.now()
}, function(err, question){
  if(err) {
    console.log(err)
  } else {
    //add username and id to question
    let user = randomUser();
    question.author.id = user.id;
    question.author.username = user.username;
    //add options one by one
    question.optionsText.push("É mais ácido");
    question.optionsText.push("É mais gorduroso");
    question.optionsText.push("É mais maturado");
    question.save();
  }
});

Question.find({}).then(allQuestions => {
  allQuestions.forEach(Qelement => {
      let randomAnswer = Qelement.optionsText[Math.floor(Math.random()*Qelement.optionsText.length)];
      let user = randomUser();
      Answer.create({answerString: randomAnswer}, function(err, answer){
        if(err) {
          console.log(answer)
        } else {
          Question.findOneAndUpdate(
            {"_id": Qelement._id}, {$inc:{quantAnswers: 1}}, {new: true}
          ).then(async function(a){
              await a.whoAnswered.push(user.id);
              await a.save();
              return a;
          }).then(async function(a){
              answer.question.id = a.id;
              answer.question.title = a.title;
              answer.question._id = a._id;
              answer.whoAnswered.id = user.id;
              answer.whoAnswered.username = user.username;
              await answer.save();
          })
        }
      })
  });
})  
/* async function selectionAgregate(){
    return (Answer.aggregate([
      {$match: {
        "question._id": "5de67693f73fc92ec0b3fd15"
      }},
        {
          "$group": {
            "_id": "$answerString",
            "count": {"$sum":1}
          }
        }
    ]).sort('_id').limit(50))
  }
  
  async function selectionPopulateAggregate(){
    return (Answer.aggregate([
        {
          "$group": {
            "_id": "$answerString",
            "count": {"$sum":1}
          }
        }
    ]).sort('_id').limit(50))
  }
  selectionAgregate().then(a => {
    console.log(a);
  }) */
  
router.get('/chartMultipleChoice', isLoggedIn, (req, res) => { 
    selectionAgregate().then(a => {
      res.render('/reports/reports', {"data": a});
    })
});

module.exports = router;