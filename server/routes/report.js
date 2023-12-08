import express from "express";
import { poseReport,exerciseReport } from "../controllers/report.js";

const router = express.Router();

router.post("/poseReport", poseReport);
router.post("/exerciseReport", exerciseReport);

export default router;
