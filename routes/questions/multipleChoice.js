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
  
router.get('/chartMultipleChoice/:id', isLoggedIn, (req, res) => { 
  selectionAgregateDataQuestion(req.params.id).then(async a => {
    let exist;
    await Question.findById(req.params.id, async function(err, question){
      if(!err){
        await question.optionsText.forEach(optQ => {
          exist = 0;
          a.forEach(opt => {
            if(opt._id == optQ){
              exist = 1;
            }
          })
          console.log(exist);
          if(exist == 0){
            console.log("ok")
            a.push({
              _id: optQ,
              count: 0
            })
          }
        })
      } else {
        console.log(err); 
      }
    })
    return a;
  }).then((a)=>{
    return a.map(obj=>({
        name:obj._id,
        data:[obj.count],
     }));
 }).then((a)=>{
    console.log(a);
    res.render('reports/MultipleChoice', {'data': JSON.stringify(a), 'parametro': 'numero de votos', 'questions': ''})
   })
})

router.get('/chartMultipleChoicePie/:id', isLoggedIn, (req, res) => { 
  selectionAgregateDataQuestion(req.params.id).then(async a => {
    let exist;
    await Question.findById(req.params.id, async function(err, question){
      if(!err){
        await question.optionsText.forEach(optQ => {
          exist = 0;
          a.forEach(opt => {
            if(opt._id == optQ){
              exist = 1;
            }
          })
          console.log(exist);
          if(exist == 0){
            console.log("ok")
            a.push({
              _id: optQ,
              count: 0
            })
          }
        })
      } else {
        console.log(err); 
      }
    })
    return a;
  }).then((a)=>{
    let total = 0;
    for (let index = 0; index < a.length; index++) {
      total += a[index].count;
    }
    console.log(total)
    return a.map(obj=>({
        name:obj._id,
        y:(obj.count/100)/(total/100),
        sliced: true,
        selected: true
     }));
  }).then((a)=>{
    console.log(a);
    res.render('reports/MultipleChoicePie', {'data': JSON.stringify(a), 'parametro': 'numero de votos', 'questions': ''})
   })
})

//pt - criar resposta fake para uma pergunta multipla escolha
//en - create answers Random for MultipleChoice
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

//pt - criar perguntas fakes 
//en - create fake Questions

//createFakeQuestions(8);
createFakeAnswers(3)
function createFakeQuestions(numberOfFakeQuestions) {
  for (let index = 0; index < numberOfFakeQuestions; index++) {
    Question.create({
      expirationDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      description: "Olá Mundo",
      title: "Automatic Question - O queijo derrete mais quando..",
      type: "multiplechoice",
    }, function(err, question){
      if(err) {
        console.log(err)
      } else {
        console.log("a questão é" + question)
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
  }
}

//pt - criar x Respostas automáticas para cada questão
//en - create x Answers For Each Question on DB
function createFakeAnswers(numberOfAnswersForEachQuestion) {
  for (let index = 0; index < numberOfAnswersForEachQuestion; index++) {
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
  }  
}

//cath the first 50's answers of on question 
async function selectionAgregateDataQuestion(idQuestion){
    return (Answer.aggregate([
      {$match: {
        "question._id": idQuestion
      }},
        {
          "$group": {
            "_id": "$answerString",
            "count": {"$sum":1}
          }
        }
    ]).sort('_id'))
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

//chamada de funções
//call functions
/* selectionAgregateDataQuestion("5e24972b254b14264813755f").then(async a => {
  let exist;
  await Question.findById("5e24972b254b14264813755f", async function(err, question){
    if(!err){
      await question.optionsText.forEach(optQ => {
        exist = 0;
        a.forEach(opt => {
          if(opt._id == optQ){
            exist = 1;
          }
        })
        console.log(exist);
        if(exist == 0){
          a.push({
            _id: optQ,
            count: 0
          })
        }
      })
    } else {
      console.log(err); 
    }
  })
  return a;
}).then((a)=>{
  let total = 0;
  for (let index = 0; index < a.length; index++) {
    total += a[index].count;
  }
  console.log(total)
  return a.map(obj=>({
      name:obj._id,
      y:[(obj.count/100)/(total/100)],
      sliced: true,
      selected: true
   }));
}).then(a => {
  console.log(a);
})  */

module.exports = router;