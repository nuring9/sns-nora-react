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
const sequelize_1 = require("sequelize");
const models_1 = require("../models");
const router = express_1.default.Router();
router.get("/:hashtag", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // GET /hashtag/해시태그
    try {
        const where = {};
        const lastId = parseInt(((_a = req.query.lastId) === null || _a === void 0 ? void 0 : _a.toString()) || "0", 10);
        // if (!isNaN(lastId)) {
        //   // 초기 로딩이 아닐 때
        //   where.id = { [Op.lt]: lastId };
        // }  오류 코드 reducers/post의 mainPosts 생성되지 않음.
        if (!isNaN(lastId) && lastId > 0) {
            // 초기 로딩이 아닐 때, && lastId가 0보다 큰 경우에만 where.id 조건이 추가.
            // 이렇게 해야 실행된다.
            where.id = { [sequelize_1.Op.lt]: lastId };
            console.log(lastId, "라스트아이디");
        }
        console.log("해시태그:", req.params.hashtag); // 해시태그 파싱 확인
        const posts = yield models_1.Post.findAll({
            where,
            limit: 10,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: models_1.Hashtag,
                    where: { title: decodeURIComponent(req.params.hashtag) }, //  Hashtag모델에서 title가져옴.
                    // URI 디코딩
                },
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
                            order: [["createdAt", "DESC"]],
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
            logging: true, // 쿼리 로깅 활성화
        });
        console.log("게시물 검색 결과:", posts); // 게시물 검색 결과 확인
        res.status(200).json(posts);
    }
    catch (error) {
        console.log("hashtag오류", error);
        next(error);
    }
}));
exports.default = router;
