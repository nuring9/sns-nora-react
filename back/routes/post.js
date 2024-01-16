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
const middlewares_1 = require("./middlewares");
const router = express_1.default.Router();
router.post("/", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield models_1.Post.create({
            content: req.body.content,
            UserId: parseInt(req.body.userId, 10),
        });
        // if (req.body.image) {
        //   if (Array.isArray(req.body.image)) {
        //     // 이미지를 여러 개 올리면 image: [사진.png, 사진2.png]
        //     const images = await Promise.all(
        //       req.body.image.map((image: any) => Image.create({ src: image }))
        //     );
        //     await post.addImages(images);
        //   } else {
        //     // 이미지를 하나만 올리면 image: 사진.png
        //     const image = await Image.create({ src: req.body.image });
        //     await post.addImages(image);
        //   }
        // }
        const fullPost = yield models_1.Post.findOne({
            where: { id: post.id },
            include: [
                {
                    model: models_1.Image,
                },
                {
                    model: models_1.Comment,
                    include: [
                        {
                            model: models_1.User, // 댓글 작성자
                            attributes: ["id", "nick"],
                        },
                    ],
                },
                {
                    model: models_1.User, // 게시글 작성자
                    attributes: ["id", "nick"],
                },
                {
                    model: models_1.User, // 좋아요 누른 사람
                    as: "Likers",
                    attributes: ["id"],
                },
            ],
        });
        res.status(201).json(fullPost); // 프론트로 돌려주기. 그럼 reducer에 response에 들어간다.
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
router.delete("/", (req, res) => {
    res.json({ id: 1 });
});
// router.get("/:postId", async (req: Request, res: Response, next) => {
//   // GET /post/1
//   try {
//     const post = await Post.findOne({
//       where: { id: req.params.postId },
//     });
//     if (!post) {
//       return res.status(404).send("존재하지 않는 게시글입니다.");
//     }
//     const comment = await Comment.create({
//       content: req.body.content,
//       PostId: parseInt(req.params.postId, 10),
//       UserId: req.body.id,
//     });
//     const fullComment = await Comment.findOne({
//       where: { id: comment.id },
//       include: [
//         {
//           model: User,
//           attributes: ["id", "nick"],
//         },
//       ],
//     });
//     res.status(200).json(fullComment);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });
router.get("/:postId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // GET /post/1
    try {
        const post = yield models_1.Post.findOne({
            where: { id: req.params.postId },
        });
        if (!post) {
            return res.status(404).send("존재하지 않는 게시글입니다.");
        }
        const fullPost = yield models_1.Post.findOne({
            where: { id: post.id },
            include: [
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
                {
                    model: models_1.User,
                    attributes: ["id", "nick"],
                },
                {
                    model: models_1.User,
                    as: "Likers",
                    attributes: ["id", "nickname"],
                },
                {
                    model: models_1.Image,
                },
                {
                    model: models_1.Comment,
                    include: [
                        {
                            model: models_1.User,
                            attributes: ["id", "nickname"],
                        },
                    ],
                },
            ],
        });
        res.status(200).json(fullPost);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post("/:postId/comment", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // POST /post/1/comment
    try {
        const post = yield models_1.Post.findOne({
            where: { id: req.params.postId },
        });
        if (!post) {
            return res.status(403).send("존재하지 않는 게시글입니다."); // return을 해야 여기서 멈춤. 밑의 res.send까지 되지않음.
        }
        const comment = yield models_1.Comment.create({
            content: req.body.content,
            PostId: parseInt(req.params.postId, 10),
            UserId: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || 0,
            // req.user.id를 사용하려면 req.user에서 undefilnd가 발생.. 프론트에서 userId?: number | undefined; 로하고, req.usr가 없으면 0을 반환하는걸로 대체하였는데 추후 코드 수정하자.
        });
        const fullComment = yield models_1.Comment.findOne({
            where: { id: comment.id },
            include: [
                {
                    model: models_1.User,
                    attributes: ["id", "nick"],
                },
            ],
        });
        res.status(201).json(fullComment);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.patch("/:postId/like", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // PATCH /post/1/like
    try {
        const post = yield models_1.Post.findOne({ where: { id: req.params.postId } });
        if (!post) {
            return res.status(403).send("게시글이 존재하지 않습니다.");
        }
        if (req.user) {
            yield post.addLikers([req.user.id]);
            res.json({ PostId: post.id, UserId: req.user.id });
        }
        else {
            return res.status(403).send("유저 정보를 찾을 수 없습니다.");
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.delete("/:postId/like", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // DELETE /post/1/like
    try {
        const post = yield models_1.Post.findOne({ where: { id: req.params.postId } });
        if (!post) {
            return res.status(403).send("게시글이 존재하지 않습니다.");
        }
        if (req.user) {
            yield post.removeLikers([req.user.id]);
            res.json({ PostId: post.id, UserId: req.user.id });
        }
        else {
            return res.status(403).send("유저 정보를 찾을 수 없습니다.");
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
