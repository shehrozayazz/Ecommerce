var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors=require('cors');

var app = express();

app.use(cors());


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



// Import Routes

const authRouter = require('./routes/users2');
const productRoutes=require('./routes/products');
const userRoutes=require('./routes/users');
// const order_details=require('./routes/order_details');
const orders=require('./routes/orders')

//  Use Routes

app.use('/api/products',productRoutes);
app.use('/api/orders',orders);
app.use('/api/auth', authRouter);
app.use('/api/users',userRoutes);





app.use(cors({
  origin:"*",
  methods:['GET','PUT','PATCH','POST','DELETE'],
  allowedHeaders:'Content-Type, Authorization,Origin,X-Requested-With,Accept'
}))



// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', '');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
