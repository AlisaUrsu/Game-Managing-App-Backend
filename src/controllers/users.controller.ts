import { UserService } from "../services/users.service";
import { RequestHandler } from "express";
import  createHttpError  from "http-errors";
import bcrypt from "bcrypt";
import { email } from "envalid";
import UserModel from "../models/user/user.model";
import { GameListService } from "../services/gameLists.service";
import mongoose from "mongoose";

export class UserController {
    private service: UserService;
    private listService: GameListService;
    
    constructor(service: UserService, listService: GameListService){
        this.service = service;
        this.listService = listService;
    }

    public signUp: RequestHandler = async(req, res, next) => {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;

        try {
            if (!username || !email || !password || !role) {
                throw createHttpError(400, "Parameters missing");
            }

            const existingUsername = await this.service.usernameExists(username);

            if (existingUsername) {
                throw createHttpError(409, "Username already taken. Please choose a different one or log in instead");
            }

            const existingEmail = await this.service.emailExists(email);

            if (existingEmail) {
                throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
            }

            const passwordHashed = await bcrypt.hash(password, 10);

            const lastLogin = new Date();

            const newUser = await this.service.addUser(username, email, passwordHashed, role, lastLogin);
            req.session.userId = (newUser as any)._id;

            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    public login: RequestHandler = async (req, res, next) => {
        const email = req.body.email;
        const password = req.body.password;
    
        try {
            if (!email || !password) {
                throw createHttpError(400, "Parameters missing");
            }
    
            const user = await this.service.loginCredentials(email);
    
            if (!user) {
                throw createHttpError(401, "Invalid credentials");
            }
    
            const passwordMatch = await bcrypt.compare(password, user.password);
    
            if (!passwordMatch) {
                console.log(user);
                throw createHttpError(401, "Invalid credentials");
            }
    
            const lastLogin = new Date();
            await this.service.updateLastLogin((user as any)._id, lastLogin);

            req.session.userId = (user as any)._id;
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    };


    public getAuthenticatedUser: RequestHandler = async (req, res, next) => {
        if (!req.session.userId) {
            return res.status(401).send('Not authenticated');
        }
        try {
            const user = await UserModel.findById(req.session.userId).select("+username").exec();
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    };

    public logout: RequestHandler = async (req, res, next) => {
        req.session.destroy(error => {
            if (error) {
                next(error);
            } else {
                res.sendStatus(200);
            }
        });
    };

    public deleteAccount: RequestHandler = async (req, res, next) => {
        const userId = req.params.id;
        try {
            if (!mongoose.isValidObjectId(userId)) {
                throw createHttpError(400, "Invalid user id");
            }
            await this.service.deleteUser(userId);
            await this.listService.deleteListOfAnUser(userId);
            res.status(204).send();
        }
        catch (error){
            next(error);
        }
    }

    public getUsersPaginated: RequestHandler = async(req, res, next) => {
        const page = Number(req.params.page);
        const records = Number(req.params.records);
        
        try {
        
            const users = await this.service.getAllUsers();
            const { currentRecords, totalPages} = await this.service.getUsersByPage(users, page, records);
            res.status(200).json({ currentRecords, totalPages });
        } catch (error) {
            next(error);
    }
    }

    
    public addAccount: RequestHandler = async(req, res, next) => {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const role = req.body.role;

        try {
            if (!username || !email || !password || !role) {
                throw createHttpError(400, "Parameters missing");
            }

            const existingUsername = await this.service.usernameExists(username);

            if (existingUsername) {
                throw createHttpError(409, "Username already taken. Please choose a different one or log in instead");
            }

            const existingEmail = await this.service.emailExists(email);

            if (existingEmail) {
                throw createHttpError(409, "A user with this email address already exists. Please log in instead.");
            }

            const passwordHashed = await bcrypt.hash(password, 10);


            const newUser = await this.service.addUser(username, email, passwordHashed, role);

            res.status(201).json(newUser);
        } catch (error) {
            next(error);
        }
    }

    

}