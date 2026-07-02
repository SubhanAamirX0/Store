import { Router } from "express";
import { getDebugStatus } from "../controllers/debug.controller.js";

const router = Router();

router.get("/status", getDebugStatus);

export default router;
