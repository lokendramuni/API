const staticRouter = require("express").Router();
const static = require("../controllers/static");


staticRouter.post('/staticcreate', static.staticcreate)
staticRouter.put('/:id', static.editstatic)

module.exports = staticRouter;