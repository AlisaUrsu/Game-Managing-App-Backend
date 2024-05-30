import mongoose from "mongoose";
import env from "./util/validateEnv";
import app from "./app";
import "dotenv/config";

const port = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_CONNECTION_STRING!)
    
        console.log("Mongoose connected.");

    app.listen(port, () => {
        console.log("Server running on port: " + port);
    })