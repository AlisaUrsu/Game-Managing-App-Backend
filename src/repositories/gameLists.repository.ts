import mongoose, { Document, Schema, Types } from "mongoose";
import { GameList } from "../models/gameList/gameList";
import GameListModel from "../models/gameList/gameList.model";
import { Game } from "../models/game/game";
import { faker } from "@faker-js/faker";
import GameModel from "../models/game/game.model";

export class GameListRepository {
    private  gameListModel;
    private gameModel;
    constructor() {
        this.gameListModel = GameListModel<GameList>;
        this.gameModel = GameModel<Game>
    }

    async addGameList(gameList: GameList): Promise<Document> {
        return await this.gameListModel.create(gameList);
    }

    async deleteGameList(userId: Types.ObjectId, gameId: Types.ObjectId): Promise<void> {
        await this.gameListModel.deleteOne({ userId: userId, gameId: gameId }).exec();
    }

    async getAllGamesLists(): Promise<Document[]> {
        return await this.gameListModel.find().exec();
    }

    async getGameFromGameList(userId: string): Promise<Document[]> {
        return await this.gameListModel.find({userId: userId}).exec();
    }

    async getGameById(gameId: string): Promise<Document[]> {
        return await this.gameListModel.find({gameId: gameId}).exec();
    }

    async deleteAGameFromAllLists(gameId: Types.ObjectId): Promise<void> {
        await this.gameListModel.deleteMany({ gameId: gameId }).exec();
    }

    async deleteListOfAnUser(userId: Types.ObjectId): Promise<void> {
        await this.gameListModel.deleteMany({userId: userId}).exec();
    }

    async updateGameList(userId: Types.ObjectId, gameId: Types.ObjectId, status: string, review?: string, rating?: number): Promise<Document | null> {
        return await this.gameListModel.findOneAndUpdate(
            { userId: userId, gameId: gameId },
            { $set: { status: status, rating: rating, review: review } },
            { new: true }
        ).exec();
    }

    async gameEntryExists(userId: Types.ObjectId, gameId: Types.ObjectId): Promise<Document | null> {
        return await this.gameListModel.findOne({ userId, gameId }).exec();
    }

    public async countGamesFromList(userId: string): Promise<number> {
        // Adjust the query according to your database schema
        return this.gameListModel.countDocuments({ userId }).exec();
    }

    public async getGamesFromList(userId: string, page: number, records: number): Promise<Document[]> {
        // Adjust the query according to your database schema
        return this.gameListModel
            .find({ userId })
            .skip((page - 1) * records)
            .limit(records)
            .exec();
    }

    async generateGameLists(): Promise<any> {
        console.log("starting");
       // await this.gameListModel.deleteMany({});
        const ids = await this.getAllGameIds();
    
        
      
        const userIds = [
            new mongoose.Types.ObjectId("664ba73355b5826a838b2e05"),
            new mongoose.Types.ObjectId("664d94de3ad682f61e9d0e05"),
            new mongoose.Types.ObjectId("66582809782c45cd5270c1ac"),
            new mongoose.Types.ObjectId("664f20d87f4d0780ee951de1"),
            new mongoose.Types.ObjectId("6658285d782c45cd5270c1be"),
            new mongoose.Types.ObjectId("6658287b782c45cd5270c1c2")
          ];

        const statuses = ['Playing', 'Played', 'On hold', 'Dropped', 'Plan to play'];
        for (let i = 0; i < 25000; i++) {
            if(i % 1000 === 0){console.log(i)}
            const randomUserId = userIds[Math.floor(Math.random() * userIds.length)];
            const id = ids[Math.floor(Math.random() * ids.length)];
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const review = faker.lorem.words();
            const rating = faker.number.int({ min: 1, max: 10 });
            
            const gameListEntry = await this.gameListModel.findOne({ userId: randomUserId, gameId: id }).exec();
            if (gameListEntry) {
                await this.updateGameList(randomUserId, id, status, review, rating);
                await this.updateGameRatingById(id);
            }
            else {
                const game = new GameList(
                    randomUserId,
                    id,
                    status,
                    review,
                    rating
                    );
                    await this.addGameList(game);
                   await this.updateGameRatingById(id);
            }
        }
        console.log('Data generation complete:');
    }

    async getAllGameIds(): Promise<mongoose.Types.ObjectId[]> {
        const ids = await this.gameModel.find({}, { _id: 1 }).exec();
        return ids.map(doc => doc._id);
    }

    async updateRatingsForAllGames() {
        // Step 1: Retrieve all game IDs
        const gameIds = await this.getAllGameIds();

        let count = 0;
        for (const gameId of gameIds) {
            await this.updateGameRatingById(gameId);
            count++;

        // Print a message every 1000 games
            if (count % 1000 === 0) {
                console.log(`${count} games processed so far.`);
            }
        }
        console.log('Ratings for all games updated successfully.');
    }
    
    async updateGameRatingById(gameId: mongoose.Types.ObjectId) {
        // Step 1: Aggregate ratings for the specific game from the GameList collection
        const result = await this.gameListModel.aggregate([
            {
                $match: { 
                    gameId: gameId,
                    rating: { $exists: true, $ne: null } // Only include entries with a rating
                }
            },
            {
                $group: {
                    _id: "$gameId",
                    averageRating: { $avg: "$rating" },
                    ratingCount: { $sum: 1 }
                }
            }
        ]);
    
        // Step 2: Update the Game collection with the computed average rating
        if (result.length > 0) {
            const averageRating = result[0].averageRating;
            const count = result[0].ratingCount;
            await this.gameModel.updateOne(
                { _id: gameId },
                { $set: { rating: averageRating, ratingCount: count } }
            ).exec();
            //console.log(`Rating for game ${gameId} updated successfully.`);
        }  else {
            // If no ratings found, set rating and count to 0
            await this.gameModel.updateOne(
                { _id: gameId },
                { $set: { rating: 0, ratingCount: 0 } }
            ).exec();
            //console.log(`No ratings found for game ${gameId}. Setting rating to 0.`);
        }
    }
    

}
