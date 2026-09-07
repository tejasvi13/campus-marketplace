import express, { Router } from "express";

import { requireUser } from "../middleware/requireUser";
import { getMyProfile, updateMyProfile } from "../controllers/userController";

const router: Router = express.Router();

router.use(requireUser);

router.get("/me", getMyProfile);
router.put("/me", updateMyProfile);

export const userRouter: Router = router;
export default router;