import express from "express";
import request from "supertest";
import { GameController } from "../controllers/games.controller";
import { GameRepository } from "../repositories/games.repository";
import { GameService } from "../services/games.service";
import { GameListRepository } from "../repositories/gameLists.repository";
import { GameListService } from "../services/gameLists.service";
import { Types } from "mongoose";

const repo = new GameRepository();
//repo.generateData();
const service = new GameService(repo);
const listRepo = new GameListRepository();
//listRepo.generateGameLists();
//listRepo.updateRatingsForAllGames();
const listService = new GameListService(listRepo);
const controller = new GameController(service, listService);
const router = express.Router();

router.get("/", controller.getAllGames);
router.get("/genres", controller.getGenres);
router.get("/platforms", controller.getPlatforms);
router.get("/developers", controller.getDevelopers);
router.get("/publishers", controller.getPublishers);
router.post("/add", controller.addGame);
router.put("/update/:id", controller.updateGame);
router.delete("/delete/:id", controller.deleteGame);
router.get("/:page/:records/:sortOption", controller.getGamesPaginatedAndFiltered);
router.get("/chart-data", controller.getChart);
router.get("/:id", controller.getGame);

export default router;