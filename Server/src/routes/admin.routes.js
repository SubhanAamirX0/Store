import { Router } from "express";
import { bulkUpdatePrices, getCatalogs, getDashboardSummary } from "../controllers/admin.controller.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.use(protect, requireAdmin);
router.get("/summary", getDashboardSummary);
router.get("/catalogs", getCatalogs);
router.patch("/products/prices", bulkUpdatePrices);

export default router;
