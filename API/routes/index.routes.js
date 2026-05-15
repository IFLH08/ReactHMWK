import { Router } from "express";
import { hola, marco, ping } from "../controllers/index.controllers.js";

const router = Router();

router.get("/", hola);
router.get("/marco", marco); 
router.get("/ping", ping);

export default router;