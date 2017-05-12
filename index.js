var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var validator = require('validator');
var isEmpty = require('lodash/isEmpty');
var moment = require('moment');

function toAlpha(string){
  return string.replace('-','').split(" ").join('');
}

function validateCoordinate(coordinate){
  var errors = {};

  if(!validator.isAlpha(toAlpha(coordinate.first_name))){
    errors.first_name = "Pas de caractéres spéciaux";
  }
  if(!validator.isAlpha(toAlpha(coordinate.last_name))){
    errors.last_name = "Pas de caractéres spéciaux";
  }
  if(validator.isEmpty(coordinate.first_name)){
    errors.first_name = "Champ obligatoire";
  }
  if(validator.isEmpty(coordinate.last_name)){
    errors.last_name = "Champ obligatoire";
  }
  if(validator.isEmpty(coordinate.adress)){
    errors.adress = "Champ obligatoire";
  }

  if(verifyAge(coordinate) < 18 ){
    errors.age = "Trop jeune !"
  }

  return errors;

};

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/views'));

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', function(req, res){
  res.render('coordinate', {errors: {}});
});

app.post('/coordinate', function(req, res){
  if(isEmpty(validateCoordinate(req.body))){
    res.render('experience', {})
  }else{
    console.log(validateCoordinate(req.body))
    res.render('coordinate', {
      last_name: req.body.last_name,
      first_name: req.body.first_name,
      adress: req.body.adress,
      errors: validateCoordinate(req.body)
    })
  }
});


app.listen(8000, function(){
  console.log('SERV START ON PORT 8000')
});

function verifyAge(age){
  var today = moment(moment.now()).format("YYYY-MM-DD")
  var array = today.split('-');
  var now = moment([array[0], array[1]]);
  var userAge = moment([age.years, age.month]);
  return now.diff(userAge, 'years')
}
