import { Router } from "express";
const router = Router();
import { createParentUser, createParentPreferences, addJobInfo, updateParentUser, updateJobInfo, updateBSPref, deleteJob, deleteUser } from "../controllers/parents.controllers";
import { interestedSitters } from "../controllers/interestedsitters.controller";

router.post('/create', createParentUser);

router.post("/preferences", createParentPreferences);

router.post("/job/details", addJobInfo);

router.patch("/update/:id", updateParentUser);

router.patch("/update/job/info/:id", updateJobInfo);

router.patch("/update/preferences/:id", updateBSPref);

router.delete("/delete/job/:id", deleteJob);

router.delete("/delete/user/:id", deleteUser);

router.get("/interested/sitters/:id", interestedSitters);

export default router;