import {ObjectId} from 'mongodb';
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from 'mongoose';
import { productSchema } from './product.schema.js';
import { reviewSchema } from './review.schema.js';
import { categorySchema } from './category.schema.js';

const ProductModel = mongoose.model('Product', productSchema);
const ReviewModel = mongoose.model('Review', reviewSchema);
const CategoryModel = mongoose.model('Category', categorySchema);

class ProductRepository{
    constructor(){
        this.collection = 'products';
    }
    async add(productData){
        try {
            //1. Get the db.
            // const db = getDB();
            // const collection = db.collection('products');
            // const collection = db.collection(this.collection);
            // await collection.insertOne(newProduct);
            // return newProduct;
            // 1. Addd the product
            // console.log(productData);
            productData.categories = productData.category.split(',').map(e => e.trim());
            console.log(productData);
            const newProduct = new ProductModel(productData);
            const savedProduct = await newProduct.save();

            //2. Update categories
             await CategoryModel.updateMany(
                {_id: {$in: productData.categories}},
                {
                    $push: {products: new ObjectId(savedProduct._id)}
                }
             )
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong with database', 500);
        }
    }

    async getAll(){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const products = await collection.find().toArray();
            console.log(products);
            return products;
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong with database', 500);
        }
    }

    async get(id){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.findOne({_id: new ObjectId(id)});
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong with database', 500)
        }
    }

    // async filter(minPrice, maxPrice, category){
    //     try {
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         let filterExpression = {};
    //         if(minPrice){
    //             filterExpression.price = {$gte: parseFloat(minPrice)};
    //         }
    //         if(maxPrice){
    //             filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)};
    //         }
    //         if(category){
    //             filterExpression.category = category;
    //         }
    //         return collection.find(filterExpression).toArray();
    //     } catch (error) {
    //         console.log(error);
    //         throw new ApplicationError('Something went wrong with database', 500);
    //     }
    // }

    // Product should have min price specified and category
    async filter(minPrice, categories){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            let filterExpression = {};
            if(minPrice){
                filterExpression.price = {$gte: parseFloat(minPrice)};
            }
            // if(maxPrice){
            //     filterExpression.price = {...filterExpression.price, $lte: parseFloat(maxPrice)};
            // }
            //converting this ['cat1', 'cat2'] from string to an array
            categories = JSON.parse(categories.replace(/'/g, '"'));
            // console.log(categories);
            if(categories){
                // filterExpression.category = category;
                // filterExpression = {$and: [{category: category}, filterExpression]};
                // filterExpression = {$or: [{category: category}, filterExpression]};
                filterExpression = {$or: [{category: {$in: categories}}, filterExpression]};
            } 
            // return collection.find(filterExpression).toArray();  
            // return collection.find(filterExpression).project({name: 1, price: 1, _id: 0, ratings: 1}).toArray();  
            // return collection.find(filterExpression).project({name: 1, price: 1, _id: 0, ratings: {$slice: 1}}).toArray();  
            return collection.find(filterExpression).project({name: 1, price: 1, _id: 0, ratings: {$slice: -1}}).toArray(); 
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong with database', 500);
        }
    }

    // async rate(userID, productID, rating){
    //     try {
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         //1. Find the product
    //         const product = await collection.findOne({_id: new ObjectId(productID)});
    //         //2. Find if the rating is present
    //         const userRating = product?.ratings?.find(r => r.userID == userID);
    //         if(userRating){
    //             //3. update the rating
    //             await collection.updateOne({
    //                 _id: new ObjectId(productID), "ratings.userID": new ObjectId(userID)
    //             },{
    //                 $set: {
    //                     "ratings.$.rating": rating
    //                 }
    //             })
    //         }else{
    //             await collection.updateOne({
    //                 _id: new ObjectId(productID),
    //             }, {
    //                 // $push: {ratings: {userID, rating}},
    //                 $push: {ratings: {userID: new ObjectId(userID), rating}},
    //             })
    //         }
    //         // await collection.updateOne({
    //         //     _id: new ObjectId(productID),
    //         // }, {
    //         //     // $push: {ratings: {userID, rating}},
    //         //     $push: {ratings: {userID: new ObjectId(userID), rating}},
    //         // })
    //     } catch (error) {
    //         console.log(error);
    //         throw new ApplicationError('Something went wrong with database', 500);
    //     }
    // }

    async rate(userID, productID, rating){
        try {
            // const db = getDB();
            // const collection = db.collection(this.collection);
            // //1. Remove existing entry
            // await collection.updateOne({
            //     _id: new ObjectId(productID)
            // }, {
            //     $pull: {ratings: {userID: new ObjectId(userID)}}
            // })
            // //2. Add new Entry
            // await collection.updateOne({
            //     _id: new ObjectId(productID),
            // }, {
            //     // $push: {ratings: {userID, rating}},
            //     $push: {ratings: {userID: new ObjectId(userID), rating}},
            // })

            // 1. Check if Product exists
            const productToUpdate = await ProductModel.findById(productID);
            if(!productToUpdate){
                throw new Error("Product not found");
            }
            //2. Get the existing review
            const userReview = await ReviewModel.findOne({product: new ObjectId(productID), user: new ObjectId(userID)});
            if(userReview){
                userReview.rating = rating;
                await userReview.save();
            }else{
                const newReview = new ReviewModel({
                    product: new ObjectId(productID),
                    user: new ObjectId(userID),
                    rating: rating
                })
                newReview.save();
            }
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong with database', 500);
        }
    }

    async averageProductPricePerCategory(){
        try {
            const db = getDB();
            return await db.collection(this.collection)
                .aggregate([
                    {
                        // stage 1: get average price per category
                        $group: {
                            _id: "$category",
                            averagePrice: {$avg: "$price"}
                        }
                    }
                ]).toArray();
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong with database', 500);
        }
    }
}

export default ProductRepository;