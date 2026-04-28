import { Router } from "express";
import { getNewsByCountry } from "../controllers/newsControllers";

const router = Router();

router.get("/:countryCode",  (req, res, next) => {
  console.log("Route hit:", req.params); // ← add this
  next();
}, getNewsByCountry);


export default router;