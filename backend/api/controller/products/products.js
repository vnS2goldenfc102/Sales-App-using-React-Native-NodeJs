const productModel = require("../../model/product")
// sku,
const HTTP = "http://192.168.1.11:3001/"
// module.exports.addProduct = async (req, res) => {
//     try{

//         // const {title, sku, price} = req.body;
//         const title = req.body.title
//         const sku = req.body.sku
//         const price = req.body.price
//         const quantity = req.body.quantity
//         const category = req.body.category
        


//         const description = req.body.description
        
//         const file = req.file
//         let image = HTTP + file.filename
//         console.log(title, sku, price, quantity, category, description, image)
        
//         if(!title || !sku || !price) return res.send("Fields are empty")

//         // let product = new productModel(req.body)
//         // product.image = image
//         // product.save()

//         const product = await productModel.create({title: title, sku: sku, price: price, image: image, category: category, description: description, quantity: quantity })

//         return res.json({
//             success : true,
//             message : "Product inserted successfully",
//             data : product
//         })

//     }catch(error){
//         return res.send(error.message)
//     }
// }

module.exports.addProduct = async (req, res) => {
    try{

        const {title, sku, price, image} = req.body;
        console.log(req.body)

        if(!title || !sku || !price) return res.send("Fields are empty")

        let product = new productModel(req.body)
        product.save()

        return res.json({
            success : true,
            message : "Product inserted successfully",
            data : product
        })

    }catch(error){
        return res.send(error.message)
    }
}

module.exports.getProducts = async (req, res) => {
    try{

        const products = await productModel.find();
        const productsCount = await productModel.find().count();

        return res.json({
            success : true,
            status : 400,
            message : "list of all products",
            data: products,
            count : productsCount
        })

    }catch(error){
        return res.send(error.message)
    }
}


module.exports.updateProduct = async (req, res) => {
    try{

        const {title, sku, price, image} = req.body;
        const {id} = req.query;
        console.log(req.body)
        console.log(id)
        // check if product exist with the given product id
        const product = await productModel.findOne({_id : id})

        if(product){
            const updatedProduct = await productModel.findByIdAndUpdate(id, req.body, {new :true})

            return res.json({
                success : true,
                status : 200,  
                message : "product updated successfully",
                data : updatedProduct
            })
        }else{
            
            return res.json({
                success : false,
                status : 400,
                message : "product does not exist"
            })

        }

    }catch(error){
        return res.send(error.message)
    }
}

module.exports.deleteProduct = async (req, res) => {
    try{

        const {id} = req.query;
        
        // check if product exist with the given product id
        const product = await productModel.findOneAndDelete({_id : id})
        if(!product){
            return res.json({
                success : false,
                message : "product does not exist",
            })
        }
        return res.json({
            success : true,
            message : "product deleted successfully",
        })

    }catch(error){
        return res.send(error.message)
    } 
}

module.exports.getAllProducts = async (req, res) => {
    try{

        // Search through title names
        var {search} = req.query
        if(!search) search = ""
        console.log(search);
        const products = await productModel.find({title:{'$regex' : search, '$options' : 'i'}})
            .populate("category")
        
        return res.json({
            success : true,
            status : 200,
            message : "list of products",
            data : products
        })

    }catch(error){
        return res.json({
            success : false,
            status : 400,
            message : error.message
        })
    }
}

