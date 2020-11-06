const express = require('express');
const jwt = require("jsonwebtoken");
const router = express.Router();
const bcrypt = require("bcrypt");
router.use(express.urlencoded({ extended: false }));

const User = require('../models/users');

 /* Register a new User */
router.post('/register', (req, res) => {
    const { email, password, password2,fname,lname } = req.body;

    if (password !== password2) {
        res.status(401).json({
            message: "Both passwords doesn't match"
        });
        return;
    }

    bcrypt.hash(password, 10).then(hashedPassword => {
        User.findOne({
            where: [{ 'email': email }]
        }).then(user=>{
            if (user) {
                res.status(401).json({
                    message: "The user is already registered!",
    
                });
            } else {
    
                User.create({
                    username: null, password: hashedPassword, email: email, fname: fname, lname: lname, date: new Date().toString()
                }).then(err => {
                    res.status(200).json({
                        message: "New User Has been created!"
                    })
                }).catch(err => {
                    res.status(401).json({
                        message: "Error While creating a new user"
                    })
    
                });
    
            }

        });
        
    });


});
router.post('/login', (req, res) => {
    const myPlaintextPassword = req.body.password;
    const myEmail = req.body.email;
    

    User.findOne({
        where: [{ 'email': myEmail }]
    }).then(user=>{
        if (user) {
            bcrypt.compare(myPlaintextPassword, user.password).then(match=>{
                
                if(match){

                    const token = jwt.sign(
                        { email: myEmail, userId: user.id },
                        "this_is_secret",
                        { expiresIn: "1h" }
                    );
                    const decodedToken=jwt.verify(token, "this_is_secret",{algorithms:['HS256','RS256']});

                    
                    console.log("\n\n"+ match+"\n Token => " + token);
                    res.status(200).json({
                        token: token, expiresIn: 3600, // This is in seconds
                        userId: user.id,
                        decodedToken:decodedToken
                    });

                }else{
                    res.status(401).json({
                        message:"Incorrect Password!"
                    });

                }
              
                
            });
    
    
        } else {
            res.status(401).json({
                message:"Unknown Email or Password!"
            });
}


    });    

});


module.exports = router;
