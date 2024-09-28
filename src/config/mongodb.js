import {MongoClient} from 'mongodb';
// import dotenv from 'dotenv';

// dotenv.config();

// const url = "mongodb://localhost:27017/ecomdb";
// const url = process.env.DB_URL; // after moving dotenv top, still error bcoz still db called first
// console.log(url);


let client;
export const connectToMongoDB = () => {
    // MongoClient.connect(url)
    MongoClient.connect(process.env.DB_URL)
        .then(clientInstance => {
            client = clientInstance;
            console.log("Mongodb is connected!");
            createCounter(client.db());
            createIndexes(client.db());
        })
        .catch(err => {
            console.log(err);
        })
}

export const getClient = () => {
    return client;
}

export const getDB = () => {
    return client.db();
}

const createCounter = async(db) => {
    const existingCounter = await db.collection('counters').findOne({_id: 'cartItemId'});
    if(!existingCounter){
        await db.collection("counters").insertOne({_id: 'cartItemId', value: 0});
    }
}

const createIndexes = async (db) => {
    try {
        await db.collection('products').createIndex({price: 1});
        await db.collection('products').createIndex({name: 1, category: -1});
        await db.collection('products').createIndex({desc: "text"});
    } catch (error) {
        console.log(error);
    }
    console.log('Indexes are created');
}