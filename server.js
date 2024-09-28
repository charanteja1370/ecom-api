// import dotenv from 'dotenv';
// dotenv.config(); // abouve db import bcoz as soon as db imported it tries access db url and throws error
import './env.js';
import express from 'express';
import swagger from 'swagger-ui-express';
import cors from 'cors';
// import dotenv from 'dotenv';

import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import bodyParser from 'body-parser';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import cartRouter from './src/features/cart/cartItems.routes.js';
// import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import apiDocs from './swagger.json' assert {type: 'json'};
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import orderRouter from './src/features/order/order.routes.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import mongoose from 'mongoose';
import likeRouter from './src/features/like/like.router.js';

const server = express();

// load all the environemnt variables in application
// dotenv.config();

// var corsOptions = {
//     origin: 'http://localhost:5500',
// }

// server.use(cors(corsOptions));

server.use(cors());


// CORS policy configuration
// server.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:5500');
//     res.header('Access-Control-Allow-Headers', '*');
//     res.header('Access-Control-Allow-Methods', '*');
//     //return ok for preflight request
//     if(req.method == "OPTIONS"){
//         return res.sendStatus(200);
//     }
//     next();
// })

server.use(express.urlencoded({ extended: true }));

server.use(express.json());
// Bearer <token>
//for all requests related to product, redirect to product routes.
// server.use('/api/products', basicAuthorizer, productRouter);
server.use('/api-docs', swagger.serve, swagger.setup(apiDocs));
server.use(loggerMiddleware);
server.use('/api/orders', jwtAuth, orderRouter);
server.use('/api/products', jwtAuth, productRouter);
server.use('/api/users', userRouter);
server.use('/api/cartItems', loggerMiddleware, jwtAuth, cartRouter);
server.use('/api/likes', jwtAuth, likeRouter);

server.get('/', (req, res) => {
    res.send('Welcome to Ecommerce APIs');
})

// Error handler middleware
server.use((err, req, res, next) => {
    console.log(err);
    if(err instanceof mongoose.Error.ValidationError){
        return res.status(400).send(err.message);
    }
    if(err instanceof ApplicationError){
        return res.status(err.code).send(err.message);
    }
    //server errors.
    res.status(500).send('Something went wrong, please try later');
})

// Middleware to handle 404 requests  // A the end
server.use((req, res) => {
    res.status(404).send("API not found. Please check our documentation for more information at localhost:3737/api-docs");
})

server.listen(3737, () => {
    console.log('Server is running at 3737');
    // connectToMongoDB();
    connectUsingMongoose();
});


