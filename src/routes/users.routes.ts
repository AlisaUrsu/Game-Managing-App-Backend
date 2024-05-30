import express from "express";
import { UserRepository } from "../repositories/users.repository";
import { UserService } from "../services/users.service";
import { UserController } from "../controllers/users.controller";
import { GameListRepository } from "../repositories/gameLists.repository";
import { GameListService } from "../services/gameLists.service";

const repo = new UserRepository();
const listRepo = new GameListRepository();
const service = new UserService(repo);
const listService = new GameListService(listRepo);
const controller = new UserController(service, listService);

const router = express.Router();

router.post("/signup", controller.signUp);
router.get("/", controller.getAuthenticatedUser);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/:page/:records", controller.getUsersPaginated);
router.post("/add-account", controller.addAccount);
router.delete("/delete-account/:id", controller.deleteAccount);

export default router;