import { GameListRepository } from "../repositories/gameLists.repository";
import {GameList} from "../models/gameList/gameList";
import { Document, Schema, Types } from "mongoose";

export class GameListService {
    private repository: GameListRepository;

    constructor(_repository: GameListRepository) {
        this.repository = _repository;
    }

    async addGameToGameList(userId: string, gameId: string, status: string, review?: string, rating?: number): Promise<Document> {
        const newGameList = new GameList(new Types.ObjectId(userId), new Types.ObjectId(gameId), status, review, rating);
        return await this.repository.addGameList(newGameList);
    }

    async getAllGamesFromAList(userId: string): Promise<number> {
        return await this.repository.countGamesFromList(userId);
    }

    public async getGamesFromList(userId: string, page: number, records: number): Promise<Document[]>{
        return await this.repository.getGamesFromList(userId, page, records);
    }

    async getAllList(): Promise<Document[] | null> {
        return await this.repository.getAllGamesLists();
    }

    async getGameById(gameId: string): Promise<Document[] | null> {
        return await this.repository.getGameById(gameId);
    }

    async deleteGameFromList(userId: string, gameId: string): Promise<void> {
        await this.repository.deleteGameList(new Types.ObjectId(userId), new Types.ObjectId(gameId));
    }

    async deleteAGameFromAllLists(gameId: string): Promise<void> {
        await this.repository.deleteAGameFromAllLists(new Types.ObjectId(gameId));
    }

    async updateGame(userId: string, gameId: string, status: string, review?: string, rating?: number): Promise<Document | null> {
        await this.repository.updateGameRatingById(new Types.ObjectId(gameId));
        return await this.repository.updateGameList(new Types.ObjectId(userId), new Types.ObjectId(gameId), status, review, rating);
    }

    async gameEntryExists(userId: string, gameId: string): Promise<Document | null> {
        return await this.repository.gameEntryExists(new Types.ObjectId(userId), new Types.ObjectId(gameId));
    }
    
    public async getGamesFromListByPage(gameList: Document[], currentPage: number, recordsPerPage: number): Promise<{ currentRecords: Document[], totalPages: number }> {
        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        const currentRecords = gameList.slice(indexOfFirstRecord, indexOfLastRecord);
        const totalPages = Math.ceil(gameList.length / recordsPerPage);
    
        return { currentRecords, totalPages };
    }

    public async deleteListOfAnUser(userId: string): Promise<void>{
        await this.repository.deleteListOfAnUser(new Types.ObjectId(userId));
    }

    public async updateGameRatingById(gameId: string): Promise<void> {
        await this.repository.updateGameRatingById(new Types.ObjectId(gameId));
    }

}
