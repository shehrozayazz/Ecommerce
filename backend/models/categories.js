const Sequelize=require('sequelize');
const db=require('../config/db');

const Categories=db.define(
    'category' ,
    {
        title:{
            type:Sequelize.STRING
        }

    }
);

module.exports=Categories;