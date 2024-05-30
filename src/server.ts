import mongoose from "mongoose";
import env from "./util/validateEnv";
import app from "./app";
import "dotenv/config";

const port = process.env.PORT;

mongoose.connect(process.env.MONGO_CONNECTION_STRING!)
    .then(() => {
        console.log("Mongoose connected.");
        app.listen(port, () => {
            console.log("Server running on port: " + port);
        })
    })
    .catch(console.error);
