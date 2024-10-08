var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const passport = require('passport');

// responssible for userLogin
const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/login', function(req,res){
  res.render('login')
})


router.get('/profile', isLoggedIn, function (req, res, next) {
  res.send("profile");
});

router.post("/register", function (req, res) {

  
  // const userData = new userModel({
  //   username: req.body.username,
  //   email: req.body.email,
  //   fullName: req.body.fullName,
  // })

  // Consice and shorter form of above code
  const { username, email, fullname } = req.body;
  const userData = new userModel({ username, email, fullname });


  userModel.register(userData, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("/profile");
    })
  })
})

router.get("/login", passport.authenticate("local" , {
  successRedirect: "/profile",
  failureRedirect : "/"
}), function(req, res){
});

router.get("/logout", function(req,res){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
