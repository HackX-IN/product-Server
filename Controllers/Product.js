const Product=require('../Models/Product')


module.exports={
    CreateProduct:async(req,res)=>{

        const newProduct=new Product(req.body)
        try {
            const savedProduct=await newProduct.save()
            res.status(200).json("product created Success")
        } catch{
            res.status(500).json("Failed to create Products")
        }

    },
    getAllProducts:async(req,res)=>{

       
        try {
            const savedProduct=await Product.find().sort({createdAt:-1})
            res.status(200).json(savedProduct)
        } catch{
            res.status(500).json("Failed to get Products")
        }

    },
    getProducts:async(req,res)=>{
        try {
            const product=await Product.findById(req.params.id)
            res.status(200).json(product)
        } catch{
            res.status(500).json("Failed to get a  Products")
        }

    },
    SearchProduct:async(req,res)=>{
        try {
            const { key } = req.params;
            const Result = await Product.aggregate(
                [
                    {
                      $search: {
                        index: "furniture",
                        text: {
                          query: key,
                          path: {
                            wildcard: "*"
                          }
                        }
                      }
                    }
                  ]);
            res.status(200).json(Result);
          } catch (error) {
            res.status(500).json("Failed to search Products");
          }
    }
}