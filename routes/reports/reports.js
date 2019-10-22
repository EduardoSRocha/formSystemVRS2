const express = require('express'),
      router = express.Router(),
      User = require('../.././models/user'),
      Question = require('../.././models/question'),
      Answer = require('../.././models/answer'),
      middleware = require("../../middleware");
      var {isLoggedIn, globalenvironment} = middleware; // destructuring assignment

//configure flash
const flash = require('connect-flash');
router.use(flash());

/**Configure global variables */
router.use(globalenvironment);

router.get('/reports', function(req, res){
    /**função para pegar todas as respostas */
    Question.find({}).exec(async function(err, AllQuestion){
      //
      let conjuntoDeQuestoes = [];
      if(!err) {
        //console.log(AllAnswers);
        var conjuntoDeRespostas;
        var indiceConjuntoDeQuestoes = 0;
        await Answer.find().populate({ path: '_question', select: 'id' }).exec(async function(err, AllAnswers){
          var tempQuestion; 
          AllQuestion.forEach(async question => {
            conjuntoDeRespostas = [];
            tempQuestion = question;
            if(!err) {
              var indiceConjuntoDeRespostas = 0;
              AllAnswers.forEach(async Answer => {
                //Converter os Ids para string e comparar os Ids 
                if(String(Answer.question.id) == String(question._id)){
                  console.log(String(Answer.question.id), String(question._id));
                  conjuntoDeRespostas[indiceConjuntoDeRespostas] = Answer;
                }
                indiceConjuntoDeRespostas++;
              })
  
              conjuntoDeQuestoes[indiceConjuntoDeQuestoes] = {
                question: tempQuestion.question,
                answer: conjuntoDeRespostas
              };
              indiceConjuntoDeQuestoes++;
  
            } else {
              console.log(err)
            }
            
          });
          //** Consultar o título da questão */
          var indiceA = 0;
          conjuntoDeQuestoes.forEach(questao => {
            console.log(questao.question);
            indiceA++;
            var indiceB = 0
            questao.answer.forEach(answer =>{
              console.log(answer.answer);
              indiceB++;
            })
            console.log();
          })
  
          res.render("reports", {'setOfAnswers': conjuntoDeQuestoes});
        })
      } else {
        console.log(err)
      }
    });
    
  })

  
router.get('/ranking', isLoggedIn, (req, res) => {
    res.render('ranking', { message: req.flash("error")})
  });

  
  function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
      return next;
    }
    req.flash("success", "Para acessar essa página, por favor, faça login")
    res.redirect("/");
  }
  
  
module.exports = router;