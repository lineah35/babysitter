import { Router } from "express";
const router = Router();
import { createBabysitterUser, findBabysitterUser } from "../controllers/babysitters.controllers";
import { createBabysitterQualifications, findBabysitterQualifications, addBSParentInfo, updateBabysitterUser, updateBabysitterQualifications } from "../controllers/babysitters.controllers";
import { displayJobsAppliedFor } from "../controllers/jobsappliedfor.controller";
import { selectedJobs } from "../controllers/applications.controller";


router.post("/registration", createBabysitterUser);

router.post("/qualifications", createBabysitterQualifications);

router.get("/retrieve", findBabysitterUser);

router.get("/find/qualifications/:id", findBabysitterQualifications);

router.patch("/add/parent/info", addBSParentInfo);

router.patch("/update/sitter/:id", updateBabysitterUser);

router.patch("/update/qualifications/:id", updateBabysitterQualifications);

router.get("/applied/for/:id", displayJobsAppliedFor);

router.post("/selected/jobs", selectedJobs);

export default router;
