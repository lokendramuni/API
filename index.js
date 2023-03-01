
const express = require('express')
const app = express();
require('./db/dbconnection');
const userRouter = require('./routes/userRouter');

 bodyParser = require('body-parser');
const staticRouter = require("./routes/staticRouter");
const productRouter = require("./routes/productRouter");
const categoryRoute = require("./routes/cateRoute");
const storeRoute = require("./routes/storeRoute");



app.use(express.urlencoded({extended:true}));  
app.use(express.json());



app.use("/app/v1/user",userRouter);
app.use("/static", staticRouter);
app.use("/product", productRouter);
app.use("/category", categoryRoute);
app.use("/store", storeRoute);  




app.listen(7000,()=>{
    console.log("server is running on 7000");
})
