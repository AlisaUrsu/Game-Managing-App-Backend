import { UserRepository } from "../repositories/users.repository";
import { User } from "../models/user/user";
import { ObjectId } from "mongoose";

export class UserService {
    private repository: UserRepository;

    constructor(_repository: UserRepository) {
        this.repository = _repository;
    }

    public async usernameExists(username: string): Promise<User | null> {
        return this.repository.getUserByUsername(username);
    }

    public async emailExists(email: string): Promise<User | null> {
        return this.repository.getUserByEmail(email);
    }

    public async loginCredentials(email: string): Promise<User | null> {
        return this.repository.getUserByEmailAndPassword(email);
    }

    public async addUser(username: string, email: string, password: string, type: string, lastLogin?: Date): Promise<User> {
        const newUser = new User(username, email, password, type, lastLogin);
        return await this.repository.addUser(newUser);
    }

    public async getAuthenticatedUser(id: ObjectId): Promise<User | null> {
        return await this.repository.getAuthenticatedUser(id);
    }

    public async deleteUser(id: string): Promise<void> {
        await this.repository.deleteUser(id);
    }

    public async updateLastLogin(userId: string, loginDate: Date): Promise<void> {
        await this.repository.updateLastLogin(userId, loginDate);
    }

    public async getUsersByPage(userList: User[], currentPage: number, recordsPerPage: number): Promise<{ currentRecords: User[], totalPages: number }> {
        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        const currentRecords = userList.slice(indexOfFirstRecord, indexOfLastRecord);
        const totalPages = Math.ceil(userList.length / recordsPerPage);
    
        return { currentRecords, totalPages };
    }

    public async getAllUsers(): Promise<User[]> {
        return await this.repository.getAllUsers();
    }
}

