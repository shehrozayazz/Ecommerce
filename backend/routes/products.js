const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Categories = require('../models/categories');
const Sequelize=require('sequelize');

const Op = Sequelize.Op


// Importing the model 

const Products = require('../models/products');
const checkAuth = require('../middleware/check-auth');

// GET All Products
router.get('/', (req, res) => {

  let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1;

  const limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit : 0;

  let startValue=0;
  let endValue=10;

  if (page > 0) {
    startValue = (page * limit) - limit;   //0,10,20,30...
    endValue = page * limit;

  
  }
  else {
    startValue = 0;
    endValue = 10;
  }
  Products.findAll({

    order: [
      // Will escape id and validate DESC against a list of valid direction parameters
      ['id', 'DESC']],
    offset: startValue, limit: endValue, // Skip 5 instances and fetch the 5 after that

    attributes: [['title', 'name'], 'price','description', 'quantity', 'image', 'id'],

    include: [
      {
        attributes: [['title', 'category']],
        model: Categories,

      }]

  },

  ).then((pro) => {
    if (pro.length > 0) {
      res.status(200).json({
        count: pro.length,
        products: pro
      });

    } else {
      res.status(404).json({
        message: "No product found!"
      });

    }


  })
    .catch(err => console.log("\n\n the error is  " + err));

});

// GET a Single Product
router.get('/:id',(req, res) => {


  

  const {id} = req.params;

  Products.findAll({
    where:[
      {'id':id}
    ],
    attributes: [['title', 'name'], 'price', 'quantity','description', 'image','images', 'id'],

    include: [
      {
        attributes: [['title', 'category']],
        model: Categories,

      }]

  },

  ).then((pro) => {
    if (pro.length > 0) {
      res.status(200).json({
      
        products: pro
      });
    


    } else {
      res.status(404).json({
        message: "No product with this id found!"
      });
     

    }
  })
    .catch(err => console.log("\n\n the error is  " + err));
});

// GET All Products from one particular category  by name

router.get('/category/:cat_name', (req, res) => {
  const {cat_name}=req.params;

  let page = (req.query.page != undefined && req.query.page != 0) ? req.query.page : 1;

  const limit = (req.query.limit != undefined && req.query.limit != 0) ? req.query.limit : 0;

  let startValue;
  let endValue;

  if (page > 0) {
    startValue = (page * limit) - limit;   //0,10,20,30...
    endValue = page * limit;
  }
  else {
    startValue = 0;
    endValue = 10;
  }
  Products.findAll({
    

    order: [
      // Will escape id and validate DESC against a list of valid direction parameters
      ['id', 'DESC']],
    //offset: startValue, limit: endValue, // Skip 5 instances and fetch the 5 after that

    attributes: [['title', 'name'], 'price', 'quantity', 'image', 'id'],

    include: [
      {

        where:[{
          title:{
            [Op.like]:`%${cat_name}`
          }
        }],
        // where:[
        //   { 'id':id }
        // ],
        attributes: [['title', 'category']],
        model: Categories,

      }]

  },

  ).then((pro) => {
    if (pro.length > 0) {
      res.status(200).json({
        count: pro.length,
        products: pro
      });

    } else {
      res.status(404).json({
        message: "No such category exists!"
      });

    }


  })
    .catch(err => console.log("\n\n the error is  " + err));

});












module.exports = router;
