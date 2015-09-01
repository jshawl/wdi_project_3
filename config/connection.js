//Connect Sequelize with Postgres
var Sequelize = require("sequelize");

if (process.env.DATABASE_URL) {
  // the application is executed on Heroku ... use the postgres database
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect:  'postgres',
    protocol: 'postgres',
    logging:  true //false
  });
} else {
  // the application is executed on the local machine
  // sequelize = new Sequelize("postgres:///wdissues_db");
  //sequelize = new Sequelize('postgres://nolds:password@localhost:5432/wdissues_db')
   sequelize = new Sequelize("postgres:///wdissues_db");
  //  sequelize = new Sequelize('postgres://nolds:password@localhost:5432/wdissues_db')
  //  remove commented out code in the future.

}

var Post = sequelize.import("../app/models/post");
var Comment = sequelize.import("../app/models/comment");
var User = sequelize.import("../app/models/user");

Comment.belongsTo(Post, {onDelete: "CASCADE"}); //nice!
Post.hasMany(Comment);
Post.belongsTo(User);
User.hasMany(Post);
Comment.belongsTo(User);
User.hasMany(Comment);

module.exports = {
  sql: Sequelize,
  do: sequelize, // what does the `do` key stand for? is it used elsewhere?
  models: {
    Post: Post,
    Comment: Comment,
    User: User
  }
}
