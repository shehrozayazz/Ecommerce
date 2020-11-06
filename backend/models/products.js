const Sequelize=require('sequelize');
const db=require('../config/db');
const Categories=require('./categories');

const Products=db.define(
    'product' ,

    {

        title:{
            type:Sequelize.STRING
        },
        image:{
            type:Sequelize.STRING
        },
        images:{
            type:Sequelize.STRING
        },
        description:{
            type:Sequelize.STRING
        },
        price:{
            type:Sequelize.INTEGER
        },
        quantity:{
            type:Sequelize.INTEGER
        },
        cat_id:{
            type:Sequelize.INTEGER
        }

    }
);
Products.belongsTo(Categories, {foreignKey: 'cat_id'}); 
module.exports=Products;