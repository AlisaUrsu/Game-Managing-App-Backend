import { RequestHandler } from "express";
import { genres as validGenres } from "../models/genres";
import {platforms as validPlatforms} from "../models/platforms";
import { GameService } from "../services/games.service";
//import {ratingCategories} from "../models/ratingCategories"
import createHttpError from "http-errors";
import mongoose  from "mongoose";
import { GameListController } from "./gameLists.controller";
import { GameListService } from "../services/gameLists.service";


export class GameController {
    private service: GameService;
    private listService: GameListService;
    
    constructor(service: GameService, listService: GameListService){
        this.service = service;
        this.listService = listService;
    }

    public getAllGames: RequestHandler = async(req, res, next) => {
        try{
            const games = await this.service.getAllGames();
            res.status(200).json(games);
        }catch (error){
            next(error);
        }
    };

    public getGamesPaginatedAndFiltered: RequestHandler = async (req, res, next) => {
        const page = Number(req.params.page);
        const records = Number(req.params.records);
        const sortOption = req.params.sortOption;
        const genres = req.query.genres ? (req.query.genres as string).split(',') : [];
        const ratingRange = req.query.rating as string | undefined;
    
        try {
            // Build the query object
            let query: any = {};
            
            if (genres.length > 0) {
                query.genres = { $in: genres };
            }
    
            if (ratingRange) {
                const [minRating, maxRating] = ratingRange.split('-').map(Number);
                query.rating = { $gte: minRating, $lte: maxRating };
            }
    
            // Build the sort object
            let sort: any = {};
            switch (sortOption) {
                case "alphabetically-decrease":
                    sort.title = -1;
                    break;
                case "alphabetically-increase":
                    sort.title = 1;
                    break;
                case "release-date-increase":
                    sort.releaseDate = 1;
                    break;
                case "release-date-decrease":
                    sort.releaseDate = -1;
                    break;
                case "rating-increase":
                    sort.rating = 1;
                    break;
                case "rating-decrease":
                    sort.rating = -1;
                    break;
                case "not-sorted":
                default:
                    sort = {};
                    break;
            }
    
            // Get total count of games that match the criteria
            const totalGames = await this.service.countGames(query);
    
            // Fetch paginated, filtered, and sorted games from MongoDB
            const games = await this.service.getGames(query, sort, page, records);
    
            const totalPages = Math.ceil(totalGames / records);
    
            res.status(200).json({ currentRecords: games, totalPages, totalGames });
        } catch (error) {
            next(error);
        }
    }
    

    public getGame: RequestHandler = async (req, res, next) => {
        const id = req.params.id;
    
        try {
            if (!mongoose.isValidObjectId(id)) {
                throw createHttpError(400, "Invalid game id");
            }

            const game = await this.service.getGameById(id);
    
            if (!game) {
                throw createHttpError(404, "Game not found");
            }
    
            res.status(200).json(game);
        } catch (error) {
            next(error);
        }
    };
    

    public addGame: RequestHandler = async(req, res, next) => {
        let { title, developer, publisher, releaseDate, platform, description, longDescription, genres, image } = req.body;

        const date = new Date(releaseDate);
        try{
            if (!title) {
                throw createHttpError(400, "Title is required.");
            }
            if (title.length < 3) {
                throw createHttpError(400, "Title must be a string of at least 3 characters.");
            }
            if (!developer) {
                throw createHttpError(400, "Developer is required");
            }
            if (!publisher) {
                throw createHttpError(400, "Publisher is required");
            }
            if (!releaseDate){
                throw createHttpError(400, "Release date is required.");
            } 
            const startDate = new Date('1958-10-18');
            const endDate = new Date(); 
            if (date < startDate || date > endDate) {
                throw createHttpError(400, "Release date must be between October 18, 1958 and today.");
            }
            if (!platform) {
                createHttpError(400, "Platforms are required");
            }
            if (!description){
                throw createHttpError(400, "Description is required.");
            }
            if (!longDescription) {
                throw createHttpError(400, "Long description is required");
            }
            if (description.length > 220) {
                throw createHttpError(400, "Description must be of maximum 220 characters");
            }
            if (!genres){
                throw createHttpError(400, "At least one genre must be selected.");
            } 
            if (!Array.isArray(genres) || genres.length === 0 || genres.length > 6 || !genres.every(genre => typeof genre === "string" && validGenres.includes(genre))) {
                throw createHttpError(400, "Genres must be an array of up to 6 strings");
            }
            
            if (!image){
                image = "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/832px-No-Image-Placeholder.svg.png"
            } 
            const newGame = await this.service.addGame(title, developer, publisher, releaseDate, platform, description, longDescription, genres, 0, image);
            res.status(201).json(newGame);
        }catch (error){
            next(error);
        }
};

    public deleteGame: RequestHandler = async(req, res, next) => {
        const id = req.params.id;
        try{
            if (!mongoose.isValidObjectId(id)) {
                throw createHttpError(400, "Invalid game id");
            }
            if (!this.service.getGameById(id)){
                throw createHttpError(404, "Game not found");
            }
            await this.listService.deleteAGameFromAllLists(id);
            await this.service.deleteGame(id);
            res.status(204).send();
        }catch (error){
            next(error);
        }
    };
        
    public updateGame: RequestHandler = async(req, res, next) => {
        const id = req.params.id;
        let {title, developer, publisher, releaseDate, platform, description, longDescription, genres, image  } = req.body;
        
        const date = new Date(releaseDate);
        try{
            if (!mongoose.isValidObjectId(id)) {
                throw createHttpError(400, "Invalid game id");
            }

            if (!this.service.getGameById(id)){
                throw createHttpError(404, "Game not found");
            }
            if (!title) {
                throw createHttpError(400, "Title is required.");
            }
            if (title.length < 3) {
                throw createHttpError(400, "Title must be a string of at least 3 characters.");
            }
            if (!developer) {
                throw createHttpError(400, "Developer is required");
            }
            if (!publisher) {
                throw createHttpError(400, "Publisher is required");
            }
            if (!releaseDate){
                throw createHttpError(400, "Release date is required.");
            } 
            const startDate = new Date('1958-10-18');
            const endDate = new Date(); 
            if (date < startDate || date > endDate) {
                throw createHttpError(400, "Release date must be between October 18, 1958 and today.");
            }
            if (!platform) {
                createHttpError(400, "Platforms are required");
            }
            if (!description){
                throw createHttpError(400, "Description is required.");
            }
            if (!longDescription) {
                throw createHttpError(400, "Long description is required");
            }
            if (description.length > 220) {
                throw createHttpError(400, "Description must be of maximum 220 characters");
            }
            if (!genres){
                throw createHttpError(400, "At least one genre must be selected.");
            } 
            if (!Array.isArray(genres) || genres.length === 0 || genres.length > 6 || !genres.every(genre => typeof genre === "string" && validGenres.includes(genre))) {
                throw createHttpError(400, "Genres must be an array of up to 6 strings");
            }
            
            const newGame = await this.service.updateGame(id, title, developer, publisher, releaseDate, platform, description, longDescription, genres, image);
            res.status(200).json(newGame);
        } catch (error){
            next(error);
        }
    }

    public getGenres: RequestHandler = async(req, res, next) => {
        try {
            const genres = validGenres;
            res.status(200).json(genres);
        } catch (error) {
            next(error);
        }
    }

    public getPlatforms: RequestHandler = async(req, res, next) => {
        try {
            const platforms = validPlatforms;
            res.status(200).json(platforms);
        } catch (error) {
            next(error);
        }
    }

    public getPublishers: RequestHandler = async(req, res, next) => {
        try {
            const publishers = await this.service.getAllPublishers();
            res.status(200).json(publishers);
        } catch (error) {
            next(error);
        }
    }

    public getDevelopers: RequestHandler = async(req, res, next) => {
        try {
            const developers = await this.service.getAllDevelopers();
            res.status(200).json(developers);
        } catch (error) {
            next(error);
        }
    }

    public getChart: RequestHandler = async(req, res, next) => {
        try {
            const genres = await this.service.getChartData();
            res.status(200).json(genres);
        } catch (error) {
            next(error);
        
        }
    }

};