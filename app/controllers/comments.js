var express = require("express");
var router = express.Router();
// can the above two be loaded in main index.js file? why re-require here?
var DB = require("../../config/connection");
var Comment = DB.models.Comment;
var Post = DB.models.Post;

function error(response, message){
  response.status(500);
  response.json({error: message}); //helpful!!
};

router.get("/comments", function(req, res){
  Comment.findAll({order: "id"}).then(function(comments){
    res.json(comments);
  });
});

router.post("/comments", function(req, res){
  console.log("request body:", req.body);
  Comment.create(req.body).then(function(comment){
  // consider adding in error handling here. 
    res.json(comment);
  })
})

// comments#index
router.get("/posts/:id/comments", function(req, res){
  Post.findById(req.params.id).then(function(post){
    if(!post) return error(res, "not found");
    post.getComments().then(function(comments){
      res.send(comments);
    });
  });
});

// comments#create
router.post("/posts/:id/comments", function(req, res){
  Post.findById(req.params.id).then(function(post){
    if(!post) return error(res, "not found");
    post.createComment(req.body) // where is `createComment` coming from? Love this implementation!
    .then(function(comments){
      res.json(comments);
    });
  });
});

//comments#update
router.patch("/comments/:id", function(req, res){
  Comment.findById(req.params.id).then(function(comment){
    if(!comment) return error(res, "not found");
    comment.updateAttributes(req.body).then(function(updatedComment){
      res.json(updatedComment)
    })
  })
})

// comments#destroy
router.delete("/comments/:id", function(req, res){
  Comment.findById(req.params.id).then(function(comment){
    if(!comment) return error(res, "not found");
    comment.destroy().then(function(){
      res.json({success: true })
    })
  })
})

module.exports = router
