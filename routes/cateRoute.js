const router = require('express').Router();
const cateController = require('../controllers/cateController')


router.post('/createCategory', cateController.createCategory);

router.post('/categoryPopulate', cateController.categoryPopulate);

module.exports = router;







