var CreatePostView = function(){
  this.$el = this.template(); // clever putting this in a prototype method!
  this.$elements = {
    titleInput: this.$el.find("input[name=title]"),
    bodyTextArea: this.$el.find("textArea[name=body]"),
    postButton: this.$el.find(".createPost"),
    cancelButton: this.$el.find(".cancel")
  };
  this.listen();
};

CreatePostView.prototype.render = function(){
  this.$el.hide();
  $(".newPost").html(this.$el);
  this.$el.slideDown();
}

CreatePostView.prototype.listen = function(){
  this.$elements.postButton.on("click", function(){
    this.createPost();
  }.bind(this))
  this.$elements.cancelButton.on("click", function(){
    this.$el.slideUp();
    this.$el.replaceWith();
  }.bind(this))
}

CreatePostView.prototype.template = function(){
  var templateScript = $("#createPostTemplate").html();
  var template = Handlebars.compile(templateScript);
  var html = template();
  html = $(html);                            //Make html string a jquery object
  return html;
};

CreatePostView.prototype.createPost = function(){
    var data = {
      title: this.$elements.titleInput.val(),
      status:"open",
      body: this.$elements.bodyTextArea.val(),
      userId: currentUser.id, // is this a global? might be useful to put in method so this can't be changed in the console.
                              // e.g. getCurrentUser()
      author: currentUser.username
    };
    Post.create(data).then(function(newPost) {
      var view = new PostView(newPost);    //This should be returned or something, no longer self rendering
                                           // not sure I follow here, but this is a helpful comment for future you!
      console.log(view);
      $('.posts').append(view.$el);
      this.$el.replaceWith();
    }.bind(this));

};
