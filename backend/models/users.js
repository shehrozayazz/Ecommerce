const Sequelize=require('sequelize');
const db=require('../config/db');

const Users=db.define(
    'user' ,
    {
       
        username:{
            type:Sequelize.STRING
        },
        password:{
            type:Sequelize.STRING
        },

       confirmed:{
           type:Sequelize.BOOLEAN,
           defaultValue:false
        },
        email:{
            type:Sequelize.STRING
        },
        fname:{
            type:Sequelize.STRING
        },
        lname:{
            type:Sequelize.STRING
        }
       

    }
);
module.exports=Users;