import { Types } from "mongoose";

export class Game {
    title: string;
    developer: string;
    publisher: string;
    releaseDate: Date;
    platform: string[];
    description: string;
    longDescription: string;
    genres: string[];
    rating: number;
    ratingCount?: number;
    image: string;
    _id?: Types.ObjectId;

    constructor(title: string, 
        developer: string,
        publisher: string,
        releaseDate: Date,
        platform: string[], description: string, longDescription: string, genres: string[], rating: number,  image: string, ratingCount?: number) {
        this.title = title;
        this.developer = developer;
        this.publisher = publisher;
        this.releaseDate = releaseDate
        this.platform = platform;
        this.description = description;
        this.longDescription = longDescription
        this.genres = genres;
        this.rating = rating;
        this.image = image;
        this.ratingCount = ratingCount;
    }
}