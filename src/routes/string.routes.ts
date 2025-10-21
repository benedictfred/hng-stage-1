import { Router } from "express";
import { createString } from "../controllers/string.controller";

const router = Router();

router.post("/", createString);

export default router;
