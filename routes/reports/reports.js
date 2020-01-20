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

router.get('/reports', isLoggedIn, function(req, res){
  selectionAgregate().then((a)=>{
    return a.map(obj=>({
        name:obj._id,
        data:[obj.count],
     }));
 }).then(function(a){
    console.log(a);
    res.render('reports/MultipleChoice', {'data': JSON.stringify(a), 'parametro': 'numero de votos', 'questions': ''})
  })
})

router.get('/ranking', isLoggedIn, (req, res) => {
  res.render('ranking', { message: req.flash("error")})
});
  
async function selectionAgregate(){
  return (Answer.aggregate([
    {$match: {
      "question._id": res.user
    }},
      {
        "$group": {
          "_id": "$answerString",
          "count": {"$sum":1}
        }
      }
  ]).sort('_id').limit(50))
}

module.exports = router;