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
// import { isLoggedIn } from "./middlewares";
const router = express_1.default.Router();
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield models_1.Post.create({
            content: req.body.content,
            UserId: parseInt(req.body.userId, 10),
        });
        // if (req.body.image) {
        //   if (Array.isArray(req.body.image)) {
        //     // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png]
        //     const images = await Promise.all(
        //       req.body.image.map((image: any) => Image.create({ src: image }))
        //     );
        //     await post.addImages(images);
        //   } else {
        //     // 이미지를 하나만 올리면 image: 제로초.png
        //     const image = await Image.create({ src: req.body.image });
        //     await post.addImages(image);
        //   }
        // }
        // const fullPost = await Post.findOne({
        //   where: { id: post.id },
        //   include: [
        //     {
        //       model: Post,
        //       as: "Retweet",
        //       include: [
        //         {
        //           model: User,
        //           attributes: ["id", "nickname"],
        //         },
        //         {
        //           model: Image,
        //         },
        //       ],
        //     },
        //     {
        //       model: User,
        //       attributes: ["id", "nickname"],
        //     },
        //     {
        //       model: User,
        //       as: "Likers",
        //       attributes: ["id", "nickname"],
        //     },
        //     {
        //       model: Image,
        //     },
        //     {
        //       model: Comment,
        //       include: [
        //         {
        //           model: User,
        //           attributes: ["id", "nickname"],
        //         },
        //       ],
        //     },
        //   ],
        // });
        res.status(201).json(post); // 프론트로 돌려주기. 그럼 reducer에 response에 들어간다.
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
router.delete("/", (req, res) => {
    res.json({ id: 1 });
});
router.get("/:postId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // GET /post/1
    try {
        const post = yield models_1.Post.findOne({
            where: { id: req.params.postId },
        });
        if (!post) {
            return res.status(404).send("존재하지 않는 게시글입니다.");
        }
        const comment = yield models_1.Comment.create({
            content: req.body.content,
            PostId: parseInt(req.params.postId, 10),
            UserId: req.body.id,
        });
        const fullComment = yield models_1.Comment.findOne({
            where: { id: comment.id },
            include: [
                {
                    model: models_1.User,
                    attributes: ["id", "nickname"],
                },
            ],
        });
        res.status(200).json(fullComment);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
