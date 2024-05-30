import mongoose from "mongoose";
import env from "./util/validateEnv";
import app from "./app";
import "dotenv/config";

const port = env.PORT || 5000;

mongoose.connect(env.MONGO_CONNECTION_STRING!)
    .then(() => {
        console.log("Mongoose connected.");
        app.listen(port, () => {
            console.log("Server running on port: " + port);
        })
    })
    .catch(console.error);
