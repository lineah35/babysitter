import { Router } from "express";
const router = Router();
import { getSitterAvailableJobs } from "../controllers/jobinfo.controller";

router.get("/get/available/jobs/:id", getSitterAvailableJobs); //fetching only.

export default router;
