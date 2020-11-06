const Sequelize=require('sequelize');
module.exports=new Sequelize('ecommerce_db','postgres','newPassword',{
    host:'localhost',
    dialect:'postgres',
    operatorAliases:false,
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    },
});
