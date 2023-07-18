const router=require('express').Router()

const ProductControllers=require('../Controllers/Product')

router.get('/getall',ProductControllers.getAllProducts)
router.get('/:id',ProductControllers.getProducts)
router.get('/search/:key',ProductControllers.SearchProduct)
router.post('/create',ProductControllers.CreateProduct)


module.exports=router;