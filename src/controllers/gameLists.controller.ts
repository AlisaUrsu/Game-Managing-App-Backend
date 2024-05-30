import { RequestHandler } from "express";
import { genres as validGenres } from "../models/genres";
import { GameListService } from "../services/gameLists.service";
//import {ratingCategories} from "../models/ratingCategories"
import createHttpError from "http-errors";
import mongoose, { Schema }  from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";


export class GameListController {
    private service: GameListService;
    
    constructor(service: GameListService){
        this.service = service;
    }

    public getAllGamesFromGameList: RequestHandler = async(req, res, next) => {
        const authenticatedUserId = req.session.userId;
        try{
            assertIsDefined(authenticatedUserId);
            const authenticatedUserIdAsString = authenticatedUserId.toString()
            const games = await this.service.getAllGamesFromAList(authenticatedUserIdAsString);
            res.status(200).json(games);
        }catch (error){
            next(error);
        }
    };

    public getGamesPaginated: RequestHandler = async (req, res, next) => {
        const page = Number(req.params.page);
        const records = Number(req.params.records);
        const authenticatedUserId = req.session.userId;
    
        try {
            assertIsDefined(authenticatedUserId);
            const authenticatedUserIdAsString = authenticatedUserId.toString();
    
            // Get total count of games from the user's list
            const totalGames = await this.service.getAllGamesFromAList(authenticatedUserIdAsString);
    
            // Fetch paginated games from the user's list
            const games = await this.service.getGamesFromList(authenticatedUserIdAsString, page, records);
    
            const totalPages = Math.ceil(totalGames / records);
    
            res.status(200).json({ currentRecords: games, totalPages });
        } catch (error) {
            next(error);
        }
    }

    public getGamesForInputedUserPaginated: RequestHandler = async (req, res, next) => {
        const page = Number(req.params.page);
        const records = Number(req.params.records);
        const userId = req.params.id;
    
        try {
            
            const totalGames = await this.service.getAllGamesFromAList(userId);
    
            // Fetch paginated games from the user's list
            const games = await this.service.getGamesFromList(userId, page, records);
    
            const totalPages = Math.ceil(totalGames / records);
    
            res.status(200).json({ currentRecords: games, totalPages, totalGames });
        } catch (error) {
            next(error);
        }
    }

    public getAllLists: RequestHandler = async(req, res, next) => {
        try {
            const games = await this.service.getAllList();
            res.status(200).json(games);
        }catch (error){
            next(error);
        }
    }

    public getGameById: RequestHandler = async(req, res, next) => {
        const gameId = req.params.id;
        const authenticatedUserId = req.session.userId;
        try {
            assertIsDefined(authenticatedUserId);
            if (!mongoose.isValidObjectId(gameId)) {
                throw createHttpError(400, "Invalid game id");
            }
            const game = await this.service.getGameById(gameId);
            res.status(200).json(game);
        } catch (error){
            next(error);
        }
    }

    public addGameToList: RequestHandler = async(req, res, next) => {
        const gameId = req.params.id;
        const status = req.body.status;
        const review = req.body.review;
        const rating = req.body.rating;
        const authenticatedUserId = req.session.userId;
        try{
            assertIsDefined(authenticatedUserId);
            if (!mongoose.isValidObjectId(gameId)) {
                throw createHttpError(400, "Invalid game id");
            }
            const authenticatedUserIdAsString = authenticatedUserId.toString()
            const existingEntry = await this.service.gameEntryExists(authenticatedUserIdAsString, gameId);
            if (existingEntry) {
                const game = await this.service.updateGame(authenticatedUserIdAsString, gameId, status, review, rating);
                if (review){
                    await this.service.updateGameRatingById(gameId);
                }
                res.status(200).json(game);
            }
            else {
                const game = await this.service.addGameToGameList(authenticatedUserIdAsString, gameId, status, review, rating);
                if (review){
                    await this.service.updateGameRatingById(gameId);
                }
                res.status(200).json(game);
            }
        }catch (error){
            next(error);
        }
    }

    public deleteGameFromList: RequestHandler = async(req, res, next) => {
        const gameId = req.params.id;
        const authenticatedUserId = req.session.userId;
        try{
            assertIsDefined(authenticatedUserId);
            if (!mongoose.isValidObjectId(gameId)) {
                throw createHttpError(400, "Invalid game id");
            }
            const authenticatedUserIdAsString = authenticatedUserId.toString()
            await this.service.deleteGameFromList(authenticatedUserIdAsString, gameId);
            await this.service.updateGameRatingById(gameId);
            res.status(204).send();
        }catch (error){
            next(error);
        }
    }

    public deleteGameOfAnUserFromList: RequestHandler = async(req, res, next) => {
        const gameId = req.params.gameId;
        const userId = req.params.userId;
        try{
            
            if (!mongoose.isValidObjectId(gameId)) {
                throw createHttpError(400, "Invalid game id");
            }
            if (!mongoose.isValidObjectId(userId)) {
                throw createHttpError(400, "Invalid game id");
            }
            await this.service.deleteGameFromList(userId, gameId);
            await this.service.updateGameRatingById(gameId);
            res.status(204).send();
        }catch (error){
            next(error);
        }
    }

    public updateGameFromList: RequestHandler = async(req, res, next) => {
        const gameId = req.params.id;
        const status = req.body.status;
        const review = req.body.review;
        const rating = req.body.rating;
        const authenticatedUserId = req.session.userId;
        try{
            assertIsDefined(authenticatedUserId);
            if (!mongoose.isValidObjectId(gameId)) {
                throw createHttpError(400, "Invalid game id");
            }
            const authenticatedUserIdAsString = authenticatedUserId.toString()
            const game = await this.service.updateGame(authenticatedUserIdAsString, gameId, status, review, rating);
            if (review){
                await this.service.updateGameRatingById(gameId);
            }
            res.status(200).json(game);
        }catch (error){
            next(error);
        }
    }

    
   
    

    };