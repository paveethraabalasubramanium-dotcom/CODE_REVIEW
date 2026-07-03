import express
from "express";

import cors
from "cors";

import dotenv
from "dotenv";

import analyzeRoutes
from "./api/routes/analyze.route.js";

dotenv.config();

const app =
  express();

app.use(cors());

app.use(
  express.json({
    limit: "10mb"
  })
);

app.get("/", (req, res) => {

  res.json({
    success: true,
    message:
      "AI Code Review API Running"
  });

});

app.use(
  "/api",
  analyzeRoutes
);

const PORT =
  process.env.PORT ||
  5000;

app.listen(PORT, () => {

  console.log(
    `Server started on port ${PORT}`
  );

});