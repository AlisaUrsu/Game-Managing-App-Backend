import { ObjectId } from "mongoose";
import { User } from "../models/user/user";
import UserModel from "../models/user/user.model";

export class UserRepository {
    private  userModel;
    constructor() {
        this.userModel = UserModel<User>;
    }

    async addUser(user: User): Promise<User> {
        return await this.userModel.create(user);
    }

    async updateUser(id: string, updatedUser: User): Promise<User> {
        const game = await this.userModel.findById(id);
        if (!game) {
            throw new Error("User not found");
        }
        Object.assign(game, updatedUser);
        await game.save();
        return game;
    }

    async deleteUser(id: string): Promise<void> {
        await this.userModel.deleteOne({ _id: id }).exec();
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userModel.find().exec();
    }

    async getUserById(id: string): Promise<User | null> {
        return await this.userModel.findById(id).exec();
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return await this.userModel.findOne({ username: username }).exec();
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return await this.userModel.findOne({ email: email }).exec();
    }

    async getUserByEmailAndPassword(email: string): Promise<User | null> {
        return await this.userModel.findOne({ email: email}).exec();
    }

    async getAuthenticatedUser(id: ObjectId): Promise<User | null> {
        return await this.userModel.findById(id).select("+username").exec();
    }

    async updateLastLogin(userId: string, loginDate: Date): Promise<void> {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
    
            user.lastLogin = loginDate;
            await user.save();

        }
    

};