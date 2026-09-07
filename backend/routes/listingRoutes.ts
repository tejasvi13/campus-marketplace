import express, { Router } from "express";

import { requireUser } from "../middleware/requireUser";
import {
  getListings,
  getMyListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
} from "../controllers/listingController";

const router: Router = express.Router();

router.use(requireUser);

router.get("/mine", getMyListings);

router.get("/", getListings);
router.post("/", createListing);
router.get("/:id", getListing);
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);

export const listingRouter: Router = router;
export default router;
