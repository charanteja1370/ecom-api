import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { categorySchema } from '../features/product/category.schema.js';

dotenv.config();
const url = process.env.DB_URL;

export const connectUsingMongoose = async () => {
    try {
        // await mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
        // console.log("Mongodb using mongoose is connected");
        mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => {
                console.log('Mongodb using mongoose is connected');
                addCategories();
            }).catch(err => console.log(err));
    } catch (error) {
        console.log(error);
    }
}

async function addCategories() {
    const CategoryModel = mongoose.model('Category', categorySchema);
    const categories = await CategoryModel.find();
    if(!categories || categories.length == 0){
        await CategoryModel.insertMany([{name: 'Books'}, {name: 'Clothing'}, {name: 'Electonics'}]);
    }
    console.log("Categories are added");
}