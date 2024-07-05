import { GameRepository } from "../repositories/games.repository";
import {Game} from "../models/game/game";
import {genres as validGenres} from "../models/genres";

export class GameService {
    private repository: GameRepository;

    constructor(_repository: GameRepository) {
        this.repository = _repository;
    }

    public async gameExists(title: string, releaseDate: Date, id?: string): Promise<boolean> {
        const games = await this.repository.findByTitleAndReleaseYear(title, releaseDate, id);
        return games.length > 0;
    }

    async addGame(title: string, developer: string, publisher: string, releaseDate: Date, platform: string[], description: string, longDescription: string, genres: string[], rating: number, image: string): Promise<Game> {
        if (await this.gameExists(title, releaseDate)) {
            throw new Error("Game already exists!");
        }
        const newGame = new Game(title, developer, publisher, releaseDate, platform, description, longDescription,  genres, rating, image);
        return await this.repository.addGame(newGame);
    }

    async updateGame(id: string, newTitle: string, newDeveloper: string, newPublisher: string, newReleaseDate: Date, newPlatform: string[], newDescription: string, newLongDescription: string, newGenres: string[], newImage: string): Promise<Game> {
        if (await this.gameExists(newTitle, newReleaseDate, id)) {
            throw new Error("Game already exists!");
        }
        const modifiedGame = {
            title: newTitle,
            developer: newDeveloper,
            publisher: newPublisher,
            releaseDate: newReleaseDate,
            platform: newPlatform,
            description: newDescription,
            longDescription: newLongDescription,
            genres: newGenres,
            image: newImage
        };
        return await this.repository.updateGame(id, modifiedGame);
    }

    async deleteGame(id: string): Promise<void> {
        await this.repository.deleteGame(id);
    }

    async getAllGames(): Promise<Game[]> {
        return await this.repository.getAllGames();
    }

    async getGameById(id: string): Promise<Game | null> {
        return await this.repository.getGameById(id);
    }

    public async sortDecreaseGamesByTitle(games: Game[]): Promise<Game[]> {
        return games.sort((a, b) => b.title.localeCompare(a.title));
    };

    public async sortIncreaseGamesByTitle(games: Game[]): Promise<Game[]> {
        return games.sort((a, b) => a.title.localeCompare(b.title));
    };

    public async sortIncreaseGamesByReleaseDate(games: Game[]): Promise<Game[]> {
        return games.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
    };

    public async sortDecreaseGamesByReleaseDate(games: Game[]): Promise<Game[]> {
        return games.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
    };

    public async sortIncreaseGamesByRating(games: Game[]): Promise<Game[]> {
        return games.sort((a, b) => a.rating - b.rating);
    };

    public async sortDecreaseGamesByRating(games: Game[]): Promise<Game[]> {
        return games.sort((a, b) => b.rating - a.rating);
    };

    public async getGamesByPage(gameList: Game[], currentPage: number, recordsPerPage: number): Promise<{ currentRecords: Game[], totalPages: number }> {
        const indexOfLastRecord = currentPage * recordsPerPage;
        const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
        const currentRecords = gameList.slice(indexOfFirstRecord, indexOfLastRecord);
        const totalPages = Math.ceil(gameList.length / recordsPerPage);
    
        return { currentRecords, totalPages };
    }

    public async filterGamesByGenres(games: Game[], genres: string[]): Promise<Game[]> {
        if (genres.length === 0) {
            return await this.getAllGames();
        }
    
        return games.filter(game =>
            genres.some(selectedGenre => game.genres.includes(selectedGenre))
        );
    }

    public async filterGamesByRating(games: Game[], ratingRange: string): Promise<Game[]> {
            const [minRating, maxRating] = ratingRange.split("-").map(parseFloat);
            return games.filter(game => game.rating >= minRating && game.rating <= maxRating);

        }

    public async getAllPublishers(): Promise<string[]> {
        return await this.repository.getAllPublishers();
    }

    public async getAllDevelopers(): Promise<string[]> {
        return await this.repository.getAllDevelopers();
    }

    public async getChartData(): Promise<{ [genre: string]: number }> {
        return await this.repository.getChartData();
    }

    public async countGames(query: any): Promise<number> {
        return this.repository.countGames(query);
    }
    
    public async getGames(query: any, sort: any, page: number, records: number): Promise<Game[]> {
        return this.repository.getGamesPaginated(query, sort, page, records );
    }
}

