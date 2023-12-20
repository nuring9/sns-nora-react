"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/post", (req, res) => {
    res.json({ id: 1, content: "hello" });
});
router.delete("/post", (req, res) => {
    res.json({ id: 1 });
});
exports.default = router;
