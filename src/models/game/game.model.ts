import { InferSchemaType, Schema, model } from "mongoose"

const GameSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    developer: {
        type: String,
        required: true
    },
    publisher: {
        type: String,
        required: true
    },
    releaseDate: {
        type: Date,
        required: true
    },
    platform: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
        required: true
    },
    genres: {
        type: [String],
        required: true
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    ratingCount: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    }
}, {timestamps: true
});

type Game = InferSchemaType<typeof GameSchema>

export default model<Game>("Game", GameSchema);