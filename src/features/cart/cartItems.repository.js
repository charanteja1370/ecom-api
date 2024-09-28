import { ObjectId, ReturnDocument } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
// import e from "express";

 
 
export default class CartItemsRepository{
    constructor(){
        this.collection = 'cartItems';
    }
    async add(productID, userID, quantity){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const id = await this.getNextCounter(db);
            // console.log(id);
            // find the document
            //either insert or update
            // Insertion
            // await collection.insertOne({productID: new ObjectId(productID), userID: new ObjectId(userID), quantity});
            await collection.updateOne({productID: new ObjectId(productID), userID: new ObjectId(userID)}, {
                $setOnInsert: {_id: id},
                $inc: {quantity: quantity}
            }, {upsert: true});
            
        } catch (err) {
            console.log(err);
            throw new ApplicationError('Something went wrong with the database', 500);
        }
        
    }

    async get(userID){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            return await collection.find({userID: new ObjectId(userID)}).toArray();
        } catch (err) {
            console.log(err);
            throw new ApplicationError('Something went wrong with database', 500);
        }
    }

    // async delete(userID, productID){
    //     try {
    //         const db = getDB();
    //         const collection = db.collection(this.collection);
    //         const result = await collection.deleteOne({userID: new ObjectId(userID), productID: new ObjectId(productID)});
    //         return result.deletedCount>0;
    //     } catch (err) {
    //         console.log(err);
    //         throw new ApplicationError('Something went wrong with database', 500);
    //     }
    // }

    async delete(userID, cartItemID){
        try {
            const db = getDB();
            const collection = db.collection(this.collection);
            const result = await collection.deleteOne({_id: new ObjectId(cartItemID), userID: new ObjectId(userID)});
            return result.deletedCount>0;
        } catch (err) {
            console.log(err);
            throw new ApplicationError('Something went wrong with database', 500);
        }
    }

    async getNextCounter(db){

        const resultDocument = await db.collection('counters').findOneAndUpdate({
            _id: 'cartItemId'
        }, {
            $inc: {value: 1}
        }, {returnDocument: 'after'}); 
        console.log(resultDocument);
        console.log(resultDocument.value);
        console.log(resultDocument.value.value);
        return resultDocument.value;
        // return resultDocument.value.value;
    }
}