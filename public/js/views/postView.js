var PostView = function(post){
  this.post = post;
  this.$el = this.template();
  this.$elements = {
    editPostButton: this.$el.find("button.editPost"),
    showCommentsButton: this.$el.find("button.showComments"),
    commentsDiv: this.$el.find(".comments")
  };
  console.log("about to listen");
  this.listen();
};

PostView.prototype.template = function(){
  var templateScript = $("#postTemplate").html();
  var template = Handlebars.compile(templateScript);
  var html = template({post: this.post, authorship: (currentUser ? currentUser.id === this.post.userId : null)});
  html = $(html);                            //Make html string a jquery object
  return html;
  // have seen these couple of lines a few times. Can you think of a way to abstract this code into something
  // reusable?
};

PostView.prototype.listen = function(){
  this.$elements.editPostButton.on("click", function(event){
    this.renderEditView();
  }.bind(this));
  this.$elements.showCommentsButton.on("click", function(event){
    this.$elements.commentsDiv.is(':empty') ? this.populateCommentsDiv() : this.toggleCommentsDiv()
  }.bind(this));
};

PostView.prototype.populateCommentsDiv = function(){
  this.post.fetchComments()
  .then(function(comments){
    comments.forEach(function(comment){
      var commentView = new CommentView(comment);
      this.$elements.commentsDiv.append(commentView.$el);
    }.bind(this));
    var createCommentView = new CreateCommentView(this);
    this.$elements.commentsDiv.hide();
    if (currentUser) { 
      this.$elements.commentsDiv.append(createCommentView.$el);
      // cool to see you not use optional curlies, but this frequently trips me up in my own code.
    }
    this.$elements.commentsDiv.slideDown();
    this.$elements.showCommentsButton.text("Hide Comments")
  }.bind(this));
}

PostView.prototype.toggleCommentsDiv = function(){
  this.$elements.commentsDiv.is(':hidden') ? this.$elements.showCommentsButton.text("Hide Comments") : this.$elements.showCommentsButton.text("Show Comments");
  this.$elements.commentsDiv.slideToggle()
}


PostView.prototype.renderEditView = function(){
  var editPostView = new EditPostView(this.post);
  console.log(editPostView);
  this.$el.replaceWith(editPostView.$el);  //Let's find a less jarring way to transition fade out, fade in?
}

PostView.prototype.postEditTemplate = function(post){
  var templateScript = $('#editPostTemplate').html();
  var template = Handlebars.compile(templateScript);
  var html = template(post);
  return html
}
