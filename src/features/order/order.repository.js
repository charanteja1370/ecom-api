import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import OrderModel from "./order.model.js";

export default class OrderRepository{
    constructor(){
        this.collection = 'orders';
    }

    async placeOrder(userId){
        const client = getClient();
            const session = client.startSession();
        try{
            
            const db = getDB();
            session.startTransaction();
            // 1. Get the cart items and calculate total amount
            // const items = await this.getTotalAmount(userId);
            const items = await this.getTotalAmount(userId, session);
            const finalTotalAmount = items.reduce((acc, item) => acc+item.totalAmount, 0);
            console.log(finalTotalAmount);

            //2. Create an order record
            const newOrder = new OrderModel(new ObjectId(userId), finalTotalAmount, new Date());
            // await db.collection(this.collection).insertOne(newOrder);
            await db.collection(this.collection).insertOne(newOrder, {session});

            //3. Reduce the stock
            for(let item of items){
                await db.collection('products').updateOne(
                    {_id: item.productID},
                    {$inc: {stock: -item.quantity}}, {session}
                )
            }
            // throw new Error('Something is wrong in placeOrder');
            //4. Clear the cart items
            await db.collection('cartItems').deleteMany({
                userID: new ObjectId(userId)
            }, {session})
            session.commitTransaction();
            session.endSession();
            return;
        }catch(err){
            await session.abortTransaction();
            session.endSession();
            console.log(err);
            throw new ApplicationError('Something went wrong with database', 500);
        }
    }

    async getTotalAmount(userId, session){
        const db = getDB();
        const items = await db.collection('cartItems').aggregate([
            // 1. get cartItems for the user
            {
                $match: {userID: new ObjectId(userId)}
            },
            //2.  get the products from products collections
            {
                $lookup: {
                    from: "products",
                    localField: "productID",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },

            // 3. unwinding the productinfo
            {
                $unwind: "$productInfo"
            },
            // 4. calculate total amount for each cart items
            {
                $addFields: {
                    "totalAmount": {
                        $multiply: ["$productInfo.price", "$quantity"]
                    }
                }
            }
        ], {session}).toArray(); 
        return items;
        // const finalTotalAmount = items.reduce((acc, item) => acc+item.totalAmount, 0);
        // console.log(finalTotalAmount);
    }
}