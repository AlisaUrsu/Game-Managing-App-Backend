import { InferSchemaType, Schema, model } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['manager', 'basic', 'admin'] },
    lastLogin: { type: Date, required: false }},
  {timestamps: true});

  type User = InferSchemaType<typeof UserSchema>

export default model<User>("User", UserSchema);