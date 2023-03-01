const productRouter = require("express").Router();
const product = require('../controllers/product');


productRouter.post('/productcreate',product.productcreate)
productRouter.post('/getpopulate',product.getpopulate)


module.exports = productRouter;