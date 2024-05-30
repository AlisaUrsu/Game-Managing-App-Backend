import { Game } from "../models/game/game";
import GameModel from "../models/game/game.model";
import { faker } from '@faker-js/faker';
import {genres} from "../models/genres";
import { platforms } from "../models/platforms";
import { images } from "../models/images";

export class GameRepository {
    private  gameModel;
    constructor() {
        this.gameModel = GameModel<Game>;
    }

    async addGame(game: Game): Promise<Game> {
        return await this.gameModel.create(game);
    }

    async updateGame(id: string, modifiedGame: Partial<Game>): Promise<Game> {
        const { rating, ratingCount, ...updateFields } = modifiedGame;
    
        const updatedGame = await this.gameModel.findOneAndUpdate(
            { _id: id },
            { $set: updateFields },
            { new: true } // This option returns the updated document
        ).exec();
    
        if (!updatedGame) {
            throw new Error("Game not found");
        }
    
        return updatedGame;
    }

    async deleteGame(id: string): Promise<void> {
        await this.gameModel.findByIdAndDelete(id).exec();
    }

    async getAllGames(): Promise<Game[]> {
        return await this.gameModel.find().exec();
    }

    async getAllGameIds(): Promise<string[]> {
        const ids = await this.gameModel.aggregate([
            { $project: { _id: 1 } }
        ]).exec();
    
        return ids.map(doc => doc._id.toString());
    }

    async getGameById(id: string): Promise<Game | null> {
        return await this.gameModel.findById(id).exec();
    }

    async findByTitleAndReleaseYear(title: string, releaseDate: Date, id?: string): Promise<Game[]> {
        let query: any = { title, releaseDate };

        if (id) {
            query._id = { $ne: id }; // Exclude documents with the provided ID
        }

       return await this.gameModel.find(query);
    }

    async getAllPublishers(): Promise<string[]> {
        return await this.gameModel.distinct('publisher').exec();
    }

    async getAllDevelopers(): Promise<string[]> {
        return await this.gameModel.distinct('developer').exec();
    }

    async generateData(): Promise<any> {
        console.log("starting");
        await this.gameModel.deleteMany({});
      
        for (let i = 0; i < 100000; i++) {
            if(i % 1000 === 0){console.log(i)}
            const image = images[Math.floor(Math.random() * images.length)];
          const game = new Game(
            faker.lorem.words(),
            faker.lorem.words(),
            faker.lorem.words(),
            faker.date.past(),
            [faker.helpers.arrayElement(platforms), faker.helpers.arrayElement(platforms)],
            faker.lorem.paragraph(),
            faker.lorem.paragraph(),
            [faker.helpers.arrayElement(genres), faker.helpers.arrayElement(genres), faker.helpers.arrayElement(genres)],
            0,
            image
          );
          await this.addGame(game);
        }
        console.log('Data generation complete.');
    }

    async getGamesPaginated(query: any, sort: any, page: number, records: number): Promise<Game[]> {
        return this.gameModel
            .find(query)
            .sort(sort)
            .skip((page - 1) * records)
            .limit(records)
            .exec();
    }

    public async countGames(query: any): Promise<number> {
        return this.gameModel.countDocuments(query).exec();
    }

   
}
