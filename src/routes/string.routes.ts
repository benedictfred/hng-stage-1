import { Router } from "express";
import {
  createString,
  deleteString,
  filterByNaturalLanguage,
  getString,
  getStringByQuery,
} from "../controllers/string.controller";

const router = Router();

router.route("/").post(createString).get(getStringByQuery);
router.route("/:string_value").get(getString).delete(deleteString);
router.get("/filter-by-natural-language", filterByNaturalLanguage);

export default router;
