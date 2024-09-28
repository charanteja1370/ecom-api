import { ApplicationError } from "../../error-handler/applicationError.js";
import { getDB } from "../../config/mongodb.js";


class UserRepository{
    constructor(){
        this.collection = 'users';
    }
    async signUp (newUser) {
        try {
            //1. Get the database
            const db = getDB();
            //2. get the collection
            // const collection = db.collection('users');
            const collection = db.collection(this.collection);
            // const newUser = new UserModel(name, email, password, type);
            // newUser.id = users.length+1;
            // users.push(newUser);

            //3. Insert the document.
            await collection.insertOne(newUser);
            return newUser;
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong', 500);
        }
    }

    async signIn (email, password) {
        try {
            // 1. get the database
            const db = getDB();
            // 2. get the collection
            // const collection = db.collection('users');
            const collection = db.collection(this.collection);
            //3. find the document
            return await collection.findOne({email, password});
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong', 500);
        }
    }

    async findByEmail(email) {
        try {
            // 1. get the database
            const db = getDB();
            // 2. get the collection
            const collection = db.collection('users');
            //3. find the document
            return await collection.findOne({email});
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong', 500);
        }
    }

    
}

export default UserRepository;