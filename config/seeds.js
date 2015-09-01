var DB = require("../config/connection")
var Post = DB.models.Post
var Comment = DB.models.Comment
var User = DB.models.User

var user = {id: 1, username: "John Master", githubId: "7882341", createdAt: "2015-08-27T22:32:35.983Z", updatedAt: "2015-08-27T22:32:35.983Z"}

var posts = [
  {title:"Post num1", body: "generic body1", status: "open", userId: 1, author: "author"},
  {title:"Post num2", body: "generic body2", status: "open", userId: 1, author: "author"},
  {title:"Post num3", body: "generic body3", status: "open", userId: 1, author: "author"},
  {title:"Post num4", body: "generic body4", status: "open", userId: 1, author: "author"}
]

var comments = [
  {body:"Are you sure you didn't capitalize something you shouldn't have?", postId: 1, userId: 1, author: "author"},
  {body:"Are you sure you didn't capitalize something you shouldn't have?", postId: 1, userId: 1, author: "author"},
  {body:"Are you sure you didn't capitalize something you shouldn't have?", postId: 2, userId: 1, author: "author"},
  {body:"Are you sure you didn't capitalize something you shouldn't have?", postId: 3, userId: 1, author: "author"},
  {body:"Are you sure you didn't capitalize something you shouldn't have?", postId: 3, userId: 1, author: "author"},
  {body:"Are you sure you didn't capitalize something you shouldn't have?", postId: 3, userId: 1, author: "author"}
]

User.create(user).then(function(){
  // can you think of a way to have dynamic ids for post and user?
  // I think this will not work if you destroy all entries and try reseeding a second time
  return Post.bulkCreate(posts)
}).then(function(){
  return Comment.bulkCreate(comments)
}).then(function(){
  console.log("Seeded successfully! kthxbye");
  process.exit();
});
