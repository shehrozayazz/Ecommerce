const Sequelize=require('sequelize');
const db=require('../config/db');
const Orders=require('./orders');
const Products = require('./products');

const OrderDetails=db.define(
    'order_details' ,
    {
        product_id:{
            type:Sequelize.INTEGER
        },
        order_id:{
            type:Sequelize.INTEGER
        },
        quantity:{
            type:Sequelize.INTEGER
        }

    }
);
OrderDetails.belongsTo(Orders, {foreignKey: 'order_id'}); 
OrderDetails.belongsTo(Products, {foreignKey: 'product_id'}); 

// OrderDetails.hasMany(Orders, {as: 'order_id'}); 
// OrderDetails.hasMany(Products, {as: 'product_id'}); 

module.exports=OrderDetails;