import express from "express";

const router = express.Router();

router.post("/post", (req, res) => {
  res.json({ id: 1, content: "hello" });
});

router.delete("/post", (req, res) => {
  res.json({ id: 1 });
});

export default router;
