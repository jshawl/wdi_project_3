var Post = function(info){
  this.title = info.title;
  this.status = info.status;
  this.body = info.body;
  this.id = info.id;
  this.userId = info.userId;
  this.author = info.author;
  this.createdAt = info.createdAt;
  this.updatedAt = info.updatedAt;

};


Post.fetch = function(){
  var request = $.getJSON("/posts")
  .then(function(response){
    var posts = [];
    for (var i = 0; i < response.length; i++){
      posts.push(new Post(response[i]));
    };
    return posts;
  })
  .fail(function(response){
    console.log("failed to fetch posts");
  });
  return request;
};

Post.create = function(postData){
  var self = this;
  var url = "/posts";
  var request = $.ajax({
    url: url,
    method: "post",
    data: JSON.stringify(postData),
    contentType: "application/json"
  })
  .then(function(postData){
    return new Post(postData);   //Maybe include some error handling++
  })
  return request;
};

Post.prototype.fetchComments = function(){
  var self = this;
  return Comment.fetch(self.id);;
};

Post.prototype.update = function(info){
  var self = this;
  var url = "/posts/" + self.id;
  var request = $.ajax({
    url: url,
    method: "patch",        //Need to make this put - can do a updatePartial and use patch at some point but currently we're using this for a full reload
                            // not sure I follow here. Patch is a great candidate here. if info only has a title, isn't that the only thing that will be updated?
    data: JSON.stringify(info),
    contentType: "application/json"
  })
  return request;
};


Post.prototype.destroy = function(){
  var self = this;
  var url = "/posts/" + self.id;
  var request = $.ajax({
    url: url,
    method: "delete"
  });
  return request;
}
