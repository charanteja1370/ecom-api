import { ApplicationError } from "../../error-handler/applicationError.js";
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";

export default class ProductController{
    constructor(){
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(req, res){
        try {
            // const products = ProductModel.getAll();
            const products = await this.productRepository.getAll();
            res.status(200).send(products);
        } catch (error) {
            console.log(error);
            return res.status(500).send('Something went wrong');
        }
        // const products = ProductModel.getAll();
        // res.status(200).send(products);
    }

    async addProduct(req, res){

        try {
            const {name, price, sizes, categories, description} = req.body;
            const newProduct = new ProductModel(name, description, parseFloat(price), req?.file?.filename, categories, sizes?.split(','));
            // const newProduct = {
            //     name, 
            //     price: parseFloat(price),
            //     sizes: sizes.split(','),
            //     imageUrl: req.file.filename,
            // }
            // const createdRecord = ProductModel.add(newProduct);
            const createdProduct = await this.productRepository.add(newProduct);
            res.status(201).send(createdProduct);
        } catch (error) {
            console.log(error);
            return res.status(500).send('Something went wrong');
        }
        // console.log(req.body);
        // console.log('This is post request');
        // res.status(200).send('Post request received');
        // const {name, price, sizes} = req.body;
        // const newProduct = {
        //     name, 
        //     price: parseFloat(price),
        //     sizes: sizes.split(','),
        //     imageUrl: req.file.filename,
        // }
        // const createdRecord = ProductModel.add(newProduct);
        // res.status(201).send(createdRecord);
    }

    async rateProduct(req, res, next){
        // console.log(req.query);
        console.log(req.body);
        try{
            // const userID = req.query.userID;
            const userID = req.userID;
            // const productID = req.query.productID;
            // const rating = req.query.rating;
            const productID = req.body.productID;
            const rating = req.body.rating;
            
            console.log("Consoling from controller", userID, productID, rating);
            // const error = ProductModel.rateProduct(userID, productID, rating);
            // try{
                // ProductModel.rateProduct(userID, productID, rating);
                await this.productRepository.rate(userID, productID, rating);
            // }
            //catch(err){
            //     // return res.status(400).send(err);
            //     return res.status(400).send(err.message);
            // }
            return res.status(200).send('Rating has been added');
        }catch(err){
            console.log(err);
            console.log('Passing error to middleware');
            next(err);
        }
        // console.log(error);
        
        // if(error){
        //     return res.status(400).send(error);
        // }else{
        //     return res.status(200).send('Rating has been added');
        // }
    }

    async getOneProduct(req, res){
        // const id = req.query.id;
        // const product = ProductModel.get(id);

        // if(!product){
        //     res.status(404).send('Product not found');
        // }else{
        //     return res.status(200).send(product);
        // }

        try {
            const id = req.params.id;
            // const products = ProductModel.getAll();
            const product = await this.productRepository.get(id)
            // res.status(200).send(product);
            if(!product){
                res.status(404).send('Product not found');
            }else{
                return res.status(200).send(product);
            }
        } catch (error) {
            console.log(error);
            return res.status(500).send('Something went wrong');
        }
    }

    async filterProducts(req, res){
        try {
            // console.log("Inside filter Products");
            const minPrice = req.query.minPrice;
            const maxPrice = req.query.maxPrice;
            // const category = req.query.category;
            const categories = req.query.categories;
            // console.table([minPrice, maxPrice, category]);
            // const result = ProductModel.filterProducts(minPrice, maxPrice, category);
            // const result = await this.productRepository.filter(minPrice, maxPrice, category);
            // const result = await this.productRepository.filter(minPrice, category);
            const result = await this.productRepository.filter(minPrice, categories);
            // console.log(result);
            
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            return res.status(500).send('Something went wrong');
        }
        // console.log("Inside filter Products");
        // const minPrice = req.query.minPrice;
        // const maxPrice = req.query.maxPrice;
        // const category = req.query.category;
        // console.table([minPrice, maxPrice, category]);
        // // const result = ProductModel.filterProducts(minPrice, maxPrice, category);
        // const result = this.productRepository.filter(minPrice, maxPrice, category);
        // console.log(result);
        
        // res.status(200).send(result);
    }

    async averagePrice(req, res, next){
        try {
            const result = await this.productRepository.averageProductPricePerCategory();
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            return res.status(500).send('Something went wrong');
        }
    }
}