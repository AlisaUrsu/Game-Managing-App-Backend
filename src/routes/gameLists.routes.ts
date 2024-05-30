import express from "express";
import request from "supertest";
import { GameListController } from "../controllers/gameLists.controller";
import { GameListRepository } from "../repositories/gameLists.repository";
import { GameListService } from "../services/gameLists.service";

const repo = new GameListRepository();
const service = new GameListService(repo);
//service.sortIncreaseGamesByID();
const controller = new GameListController(service);
const router = express.Router();

router.get("/", controller.getAllGamesFromGameList);
router.post("/add-game/:id", controller.addGameToList);
router.delete("/delete-game/:id", controller.deleteGameFromList);
router.put("/update-game/:id", controller.updateGameFromList);
router.get("/:page/:records", controller.getGamesPaginated);
router.get("/:id/:page/:records", controller.getGamesForInputedUserPaginated);
router.get("/:id", controller.getGameById);
router.delete("/:userId/delete-game/:gameId", controller.deleteGameOfAnUserFromList);
//router.get("/", controller.getAllLists);


export default router;