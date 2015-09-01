var Comment = function(info){
  this.body = info.body;
  this.id = info.id;
  this.userId = info.userId;
  this.author = info.author;
  this.createdAt = info.createdAt;
};

Comment.fetch = function(postId){
  var url = "/posts/" + postId + "/comments";
  var request = $.getJSON(url)
  .then(function(response){
    var comments = [];
    for (var i = 0; i < response.length; i++){
      comments.push(new Comment(response[i]))
    }
    // excellent!!!
    return comments;
  })
  .fail(function(response){
    console.log("failed to fetch comments for Post with id: " +postId);
    // maybe include a message for the user to see?
  })
  return request;
};

Comment.create = function(commentData){
  var url = "/posts/" + commentData.postId + "/comments";
  var request = $.ajax({
    url: url,
    method: 'post',
    data: JSON.stringify(commentData),
    contentType: "application/json"
  })
  .then(function(commentData){
    return new Comment(commentData);
  })
  return request;
};

Comment.prototype.destroy = function(){
  var url = "/comments/" + this.id;
  console.log('deleting comment');
  var request = $.ajax({
    url: url,
    method: 'delete'
  });
  return request;
}
