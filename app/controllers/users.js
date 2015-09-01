var express = require("express");
var router = express.Router();
var DB = require("../../config/connection");
var User = DB.models.User;

function error(response, message){
  response.status(500);
  response.json({error: message})
};

router.get("/users", function(req, res){
  //get all users
  // some people might be upset if they knew there info was being exposed like this. I recommend creating an admin role
  // who are the only ones who can see this.
  User.findAll().then(function(users){
    res.json(users);
  })
})

router.get("/users/:id", function(req, res){
  User.findById(req.params.id)
  .then(function(user){
    if(!user) return error(res, "not found");
    res.json(user);
  });
});

module.exports = router
