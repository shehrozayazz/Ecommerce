const Sequelize=require('sequelize');
const db=require('../config/db');
const OrderDetails = require('./order_details');
const Users=require('./users');

const Orders=db.define(
    'order' ,
    {
        user_id:{
            type:Sequelize.NUMBER
        },
        date:{
            type:Sequelize.DATE

        },
        createdAt:{
            type:Sequelize.DATE

        },
        updatedAt:{
            type:Sequelize.DATE

        },

    }
);
// Orders.belongsTo(OrderDetails,{foreignKey:'order_id'});
Orders.belongsTo(Users, {foreignKey: 'user_id'}); 
module.exports=Orders;