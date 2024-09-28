import  UserModel  from "./user.model.js";
import jwt from 'jsonwebtoken';
import UserRepository from "./user.respository.js";
import bcrypt from 'bcrypt';
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserController{
    constructor(){
        this.userRepository = new UserRepository(); 
    }
    async signUp(req, res, next){
        const {name, email, password, type} = req.body;
        try {
            // const user = await UserModel.signUp(name, email, password, type);
            const hashedPassword = await bcrypt.hash(password, 12);
            // const user = new UserModel(name, email, password, type);
            const user = new UserModel(name, email, hashedPassword, type);
            await this.userRepository.signUp(user);
            res.status(201).send(user);
        } catch (error) {
            next(error);
            console.log(error);
            // return res.status(500).send('Something went wrong');
        }
        
    }

    async signIn(req, res){
        try {
            const user = await this.userRepository.findByEmail(req.body.email);
            if(!user){
                return res.status(400).send('Incorrect credentials');
            }else{
                // compare password with hashed password
                const result = await bcrypt.compare(req.body.password, user.password);
                if(result){
                    //1. Create Token
                    // const token = jwt.sign({userID: result.id, email: result.email}, "RYAsmU35H5hvlPLsuSvl0Ag4VEYIHuyb", {
                    //     expiresIn: '1h',
                    // });
                    // const token = jwt.sign({userID: result.id, email: result.email}, process.env.JWT_SECRET, {
                    //     expiresIn: '1h',
                    // });
                    const token = jwt.sign({userID: user._id, email: user.email}, process.env.JWT_SECRET, {
                        expiresIn: '1h',
                    });
                    //2. Send token
                    return res.status(200).send(token);
                }else{
                    return res.status(400).send('Incorrect credentials');
                }
            }
            // const result = UserModel.signIn(req.body.email, req.body.password);
            // const result = await this.userRepository.signIn(req.body.email, req.body.password);
            // if(!result){
            //     return res.status(400).send('Incorrect credentials');
            // }else{
            //     // //1. Create Token
            //     // const token = jwt.sign({userID: result.id, email: result.email}, "RYAsmU35H5hvlPLsuSvl0Ag4VEYIHuyb", {
            //     //     expiresIn: '1h',
            //     // });
            //     // //2. Send token
            //     // return res.status(200).send(token);
            // }
        } catch (error) {
            console.log(error); 
            return res.status(500).send('Something went wrong');
        }
    }

    async resetPassword(req, res, next){
        const {newPassword} = req.body;
        const userID = req.userID;
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        try {
            await this.userRepository.resetPassword(userID, hashedPassword);
            res.status(200).send("Password is reset");
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong', 500);
        }
    }
}