import { Schema, Types } from "mongoose";

export class GameList {
    userId: Types.ObjectId;
    gameId: Types.ObjectId;
    status: string;
    review?: string;
    rating?: number;

    constructor(userId: Types.ObjectId, gameId: Types.ObjectId, status: string, review?: string, rating?: number){
        this.userId = userId;
        this.gameId = gameId;
        this.status = status;
        this.review = review;
        this.rating = rating;
    }
}

