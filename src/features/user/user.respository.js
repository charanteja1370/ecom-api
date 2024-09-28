import mongoose from "mongoose";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";


//creating model from schema
const UserModel = mongoose.model('User', userSchema);

export default class UserRepository{
    async signUp(user){
        try {
            // create instance of model
            const newUser = new UserModel(user);
            await newUser.save();
            return newUser;
        } catch (error) {
            console.log(error);
            if(error instanceof mongoose.Error.ValidationError){
                throw error;
            }else{
                throw new ApplicationError("Something went wron with database", 500);
            }
            
        }  
    }

    async signIn(email, password){
        try {
            return await UserModel.findOne({email, password})
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wron with database", 500);
        }  
    }

    async findByEmail(email) {
        try {
            // // 1. get the database
            // const db = getDB();
            // // 2. get the collection
            // const collection = db.collection('users');
            // //3. find the document
            // return await collection.findOne({email});
            return await UserModel.findOne({email});
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong', 500);
        }
    }

    async resetPassword(userID, newPassword){
        try {
            let user = await UserModel.findById(userID);
            if(user){
                user.password = newPassword;
                user.save();
            }else{
                throw new Error("User not found");
            }
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong', 500);
        }
    }
}