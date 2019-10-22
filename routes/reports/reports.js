const express = require('express'),
      router = express.Router(),
      User = require('../.././models/user'),
      MultipleChoice = require('../.././models/multipleChoice'),
      MultipleChoiceAnswer = require('../.././models/multipleChoiceAnswer'),
      middleware = require("../../middleware");
      var {isLoggedIn, globalenvironment} = middleware; // destructuring assignment

//configure flash
const flash = require('connect-flash');
router.use(flash());

/**Configure global variables */
router.use(globalenvironment);

router.get('/reports', function(req, res){
    /**função para pegar todas as respostas */
    MultipleChoice.find({}).exec(async function(err, AllMultipleChoice){
      //
      let conjuntoDeQuestoes = [];
      if(!err) {
        //console.log(AllMultipleChoiceAnswers);
        var conjuntoDeRespostas;
        var indiceConjuntoDeQuestoes = 0;
        await MultipleChoiceAnswer.find().populate({ path: '_question', select: 'id' }).exec(async function(err, AllMultipleChoiceAnswers){
          var tempMultipleChoice; 
          AllMultipleChoice.forEach(async multipleChoice => {
            conjuntoDeRespostas = [];
            tempMultipleChoice = multipleChoice;
            if(!err) {
              var indiceConjuntoDeRespostas = 0;
              AllMultipleChoiceAnswers.forEach(async Answer => {
                //Converter os Ids para string e comparar os Ids 
                if(String(Answer.question.id) == String(multipleChoice._id)){
                  console.log(String(Answer.question.id), String(multipleChoice._id));
                  conjuntoDeRespostas[indiceConjuntoDeRespostas] = Answer;
                }
                indiceConjuntoDeRespostas++;
              })
  
              conjuntoDeQuestoes[indiceConjuntoDeQuestoes] = {
                question: tempMultipleChoice.question,
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