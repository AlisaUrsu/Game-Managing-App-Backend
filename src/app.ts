import express, {NextFunction, Request, Response} from "express";
import "dotenv/config";
import cors from "cors";
import bodyParser from "body-parser";
import GameModel from "./models/game/game.model"
import gamesRoutes from "./routes/games.routes"
import usersRoutes from "./routes/users.routes"
import gameListRoutes from "./routes/gameLists.routes";
import session, { Cookie } from "express-session";
import MongoStore from "connect-mongo";
import env from "./util/validateEnv";
import createHttpError, {isHttpError} from "http-errors";
import { requiresAuth } from "./middleware/auth";

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use(session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 24,
    },
    rolling: true,
    store: MongoStore.create({
        mongoUrl: env.MONGO_CONNECTION_STRING,
    })
}))

app.use("/api/games", gamesRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/your-list", requiresAuth, gameListRoutes);
app.get('/api/ping', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
})

app.use((error: unknown, req: Request, res: Response, next: NextFunction)=>{
    console.error(error);
    let errorMessage = "An unknown error occurred.";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    

    res.status(statusCode).json({ error: errorMessage });
});


export default app; 