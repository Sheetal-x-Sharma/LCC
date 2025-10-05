import express from "express";
import { googleLogin, completeRegister, getMe, logout } from "../controllers/auth.js";

const router = express.Router();

router.post("/google", googleLogin);
router.post("/register", completeRegister);
router.get("/me", getMe);
router.post("/logout", logout);   // ✅ new logout route

export default router;
