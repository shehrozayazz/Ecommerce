const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Categories = require('../models/categories');
const Sequelize = require('sequelize');
const checkAuth=require('../middleware/check-auth');


const Op = Sequelize.Op


// Importing the model 

const order_details = require('../models/order_details');
const Orders = require('../models/orders');
const Products = require('../models/products');
const Users = require('../models/users');

//  GET All Orders
router.get('/', (req, res) => {

  order_details.findAll({

    attributes: [['id', 'order_detail_id']],
    include: [
      {
        attributes: [['id', 'order_id']],
        model: Orders,
        include: [{
          model: Users,
          attributes: ['username']

        }]

      },

      {
        attributes: [['title', 'name'], 'description', 'price'],
        model: Products,

      }
    ]

  }

  ).then((pro) => {
    if (pro.length > 0) {
      res.status(200).json({
        count: pro.length,
        products: pro
      });

    } else {
      res.status(404).json({
        message: "No orders found!"
      });

    }


  })
    .catch(err => console.log("\n\n the error is  " + err));

});



//  GET All Orders with Order_id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  order_details.findAll({
    where: [{ 'order_id': id }],

    attributes: [['id', 'order_detail_id'],['quantity','quantityOrdered']],
    include: [
      {
        attributes: [['id', 'order_id']],
        model: Orders,
        include: [{
          model: Users,
          attributes: ['username']

        }]

      },

      {
        attributes: [['title', 'name'], 'description', 'price','image'],
        model: Products,

      }
    ]

  }

  ).then((pro) => {
    if (pro.length > 0) {
      res.status(200).json({
        count: pro.length,
        products: pro
      });

    } else {
      res.status(404).json({
        message: "No orders with this order id found!"
      });

    }


  })
    .catch(err => console.log("\n\n the error is  " + err));

});


// Place a new Order

router.post('/new', (req, res) => {
  let { userId, products } = req.body;

 // console.log(new Date().toString());
  if (userId !== null && userId > 0 && !isNaN(userId)) {
    order = Orders.create({
      user_id: userId, date: new Date().toString()
    })
    .then(oId => {

      const newId=oId['dataValues']['id'];

      
      if (newId > 0) {
        products.forEach(async (p) => {
         

          let datsa = Products.findAll({
           attributes: ['quantity'],
            where: [{ 'id': p.id }]
          }).then(ew=>{
           
          let data=ew[0]['dataValues']['quantity'];

          let incart = p.incart;


          // Deduct the number of pieces ordered from the quantity column in database
         
          if (data > 0) {
            data = data - incart;

            
            if (data < 0) {
              data = 0;
            }
          } else {
            data = 0;
          }

          // Insert Order Details w.r.t the new newly generated Id

          order_details.create({
            'order_id': newId,
            'product_id': p.id,
            'quantity': incart
          }).then(newIdPro => {
            Products.update(
              {'quantity':data},
              {where:{'id':p.id}}
              )


          
          });


          
          
          });

          // let incart = p.incart;


          // // Deduct the number of pieces ordered from the quantity column in database
         
          // if (data.quantity > 0) {
          //   // console.log("\n\n\n  data.quantity = data.quantity - incart\n\n =>  ");
          //   // console.log(data.quantity+" - "+p.incart);
          //   // console.log("\n\n\n\n");
          //   data.quantity = data.quantity - incart;

            
          //   if (data.quantity < 0) {
          //     data.quantity = 0;
          //   }
          // } else {
          //   data.quantity = 0;
          // }

          // // Insert Order Details w.r.t the new newly generated Id

          // order_details.create({
          //   'order_id': newId,
          //   'product_id': p.id,
          //   'quantity': incart
          // }).then(newIdPro => {
          //   Products.update(
          //     {'quantity':data.quantity},
          //     {where:{'id':p.id}}
          //     )


          
          // });

        }
        );
      }
      else{
      
        res.json({message:`Order Failed placed with order id ${newId} in order details`});
      }
      res.json({
        message:`Order successfully placed with order id ${newId}`,
        success:true,
        order_id:newId,
        products:products,

      });


    }
    ).catch(err => console.log(err));



  }
  else{
    res.json({message:"New Order failed!",success:false});
  }



});





// Payment Gateway
router.post('/payment', (req, res) => {
  setTimeout(() => {
      res.status(200).json({success: true});
  }, 3000)
});

module.exports = router;