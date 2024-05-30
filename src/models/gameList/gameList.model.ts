import { Document, InferSchemaType, Schema, Types, model } from "mongoose";

const GameListSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'User', required: true },
    gameId: { type: Types.ObjectId, ref: 'Game', required: true },
    status: { type: String, required: true, enum: ['Playing', 'Played', 'On hold', 'Dropped', 'Plan to play'] },
    review: { type: String },
    rating: {type: Number}}, {timestamps: true}
  );

  type GameList = InferSchemaType<typeof GameListSchema> & Document;

export default model<GameList>("GameList", GameListSchema);