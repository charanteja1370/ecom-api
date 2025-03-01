import express from 'express';
import  UserController  from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';

const userRouter = express.Router();

const userController = new UserController();

// userRouter.post('/signup', userController.signUp);  //TypeError: Cannot read properties of undefined (reading 'userRepository')
userRouter.post('/signup', (req, res, next) => {
    userController.signUp(req, res, next);
})
// userRouter.post('/signin', userController.signIn);
userRouter.post('/signin', (req, res) => {
    userController.signIn(req, res);
})

userRouter.put('/resetPassword', jwtAuth, (req, res) => {
    userController.resetPassword(req, res);
})

export default userRouter;
