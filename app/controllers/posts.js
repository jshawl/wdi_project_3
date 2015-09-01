var express = require("express");
var router = express.Router();
var DB = require("../../config/connection");
var Post = DB.models.Post;


function error(response, message){ // move this method to a global to DRY up code.
  response.status(500);
  response.json({error: message})
}

// posts#index
router.get("/posts", function(req, res){
  //get all posts
  Post.findAll({order: "id"}).then(function(posts){
    res.json(posts);
  })
})

// posts#create
router.post("/posts", function(req, res){
  console.log("Post request body: " + req.body);
  Post.create(req.body).then(function(post){
    res.json(post);
  });
});

// posts#show
router.get("/posts/:id", function(req, res){
  Post.findById(req.params.id)
  .then(function(post){
    if(!post) return error(res, "not found");
    res.json(post);
  });
});

// posts#update
router.patch("/posts/:id", function(req, res){
  Post.findById(req.params.id)
  .then(function(post){
    if(!post) return error(res, "not found");
    post.updateAttributes(req.body).then(function(updatedPost){
      res.json(updatedPost);
    });
  });
});

// posts#destroy
router.delete("/posts/:id", function(req, res){
  Post.findById(req.params.id).then(function(post){
    if(!post) return error(res, "not found");
    post.destroy().then(function(){
      res.json({success: true});
    });
  });
});

module.exports = router
// excellent controller! helpful code comments and error handling!!
