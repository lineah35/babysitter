import { Router } from "express";
const router = Router();
import { logIn, forgotPW, resetPW } from "../controllers/auth.controller";

router.post("/login", logIn);

router.post("/forgot/password", forgotPW);

router.post("/reset/password", resetPW);

export default router;