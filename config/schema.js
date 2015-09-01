var DB = require("./connection");

// ah here it is!
DB.do.sync({force: true}).then(function(){
  console.log("Its working");
  process.exit();
});
