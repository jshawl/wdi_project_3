var CreateCommentView = function(postView){
  this.postView = postView;
  this.$el = this.template();
  this.$elements = {
    textArea: this.$el.find("textArea"),
    submitButton: this.$el.find(".submitComment"),
  };
  this.listen();
};
CreateCommentView.prototype.template = function(){
  var templateScript = $("#createCommentTemplate").html();
  var template = Handlebars.compile(templateScript);
  var html = template();
  html = $(html);                            //Make html string a jquery object
  return html
};
CreateCommentView.prototype.listen = function(){
  this.$elements.submitButton.on("click", function(){
    this.createComment();
  }.bind(this)) // i've noticed a few .bind()s and a few var self = this. They both work, but try using one or the other for consistency.
};

CreateCommentView.prototype.createComment = function(){
  var data = {
    body: this.$elements.textArea.val(),
    postId: this.postView.post.id,
    userId: currentUser.id,
    author: currentUser.username
  };

  Comment.create(data).then(function(newComment){  //this is doing too much i like this solution!
    console.log("Listening from createCommentView.js")
    this.$el.replaceWith();
    this.postView.$elements.commentsDiv.append(new CommentView(newComment).$el); //gross maybe separate lines will reduce the grossness, but i still like this!
    this.postView.$elements.commentsDiv.append(new CreateCommentView(this.postView).$el)
  }.bind(this))
}
