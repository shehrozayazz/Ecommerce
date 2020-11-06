const Sequelize=require('sequelize');
const db=require('../config/db');
const Users=require('./users');

const Addresses=db.define(
    'address' ,
    {
        line:{
            type:Sequelize.STRING
        },
        city:{
            type:Sequelize.STRING
        },
        country:{
            type:Sequelize.STRING
        },
        phone:{
            type:Sequelize.STRING
        },
        user_id:{
            type:Sequelize.INTEGER
        }
    }
);
Addresses.belongsTo(Users, {foreignKey: 'user_id'}); 
module.exports=Addresses;