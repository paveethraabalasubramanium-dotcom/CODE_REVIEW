import express
from "express";

import {
  analyzeCode
}
from "../controllers/analyze.controller.js";

const router =
  express.Router();

router.post(
  "/analyze",
  analyzeCode
);

export default router;