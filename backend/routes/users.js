var express = require('express');
const Users = require('../models/users');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// Add a gig
router.post('/add/:id/:username/:password/:fname/:lname',async (req, res) => {

  console.log("\n The titile is  => \n");

  const {id, username, password,fname,lname } = req.params;
  // Insert into table 

  Users.create({
    id:id,
      username:username,password:password,fname:fname,lname:lname
  }).then(() => console.log("\n The user was ceated successfully!"))
      .catch(err => console.log(err));
  res.sendStatus(200);
});


module.exports = router;
