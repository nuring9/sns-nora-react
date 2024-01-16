"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const router = express_1.default.Router();
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // GET /posts
    try {
        const where = {};
        const lastId = parseInt(((_a = req.query.lastId) === null || _a === void 0 ? void 0 : _a.toString()) || "0", 10);
        // undefined일 경우도 문자열로 변환 후 parsInt하려고, toString() 사용.
        if (!isNaN(lastId)) {
            // 초기 로딩이 아닐 때,
            where.id = { [sequelize_1.Op.lt]: lastId };
        }
        // if (lastId) {
        //   // 초기 로딩이 아닐 때,
        //   where.id = { [Op.lt]: lastId };
        // }
        const posts = yield models_1.Post.findAll({
            where,
            limit: 10,
            order: [
                ["createdAt", "DESC"],
                [models_1.Comment, "createdAt", "DESC"],
            ],
            include: [
                {
                    model: models_1.User,
                    attributes: ["id", "nick"],
                },
                {
                    model: models_1.Image,
                },
                {
                    model: models_1.Comment,
                    include: [
                        {
                            model: models_1.User,
                            attributes: ["id", "nick"],
                        },
                    ],
                },
                {
                    model: models_1.User, // 좋아요 누른 사람
                    as: "Likers",
                    attributes: ["id"],
                },
                {
                    model: models_1.Post,
                    as: "Retweet",
                    include: [
                        {
                            model: models_1.User,
                            attributes: ["id", "nick"],
                        },
                        {
                            model: models_1.Image,
                        },
                    ],
                },
            ],
        });
        res.status(200).json(posts);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
