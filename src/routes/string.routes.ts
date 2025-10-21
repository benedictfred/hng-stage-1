import { Router } from "express";
import {
  createString,
  filterByNaturalLanguage,
  getString,
  getStringByQuery,
} from "../controllers/string.controller";

const router = Router();

router.route("/").post(createString).get(getStringByQuery);
router.get("/:string_value", getString);
router.get("/filter-by-natural-language", filterByNaturalLanguage);

export default router;
