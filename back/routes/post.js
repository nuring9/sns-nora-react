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
const multer_1 = __importDefault(require("multer")); // 추가
const path_1 = __importDefault(require("path")); // 추가
const fs_1 = __importDefault(require("fs")); // 추가
const router = express_1.default.Router();
try {
    fs_1.default.readdirSync("uploads"); // uploads라는 폴더가 있는지 확인.  readdirSync: 동기방식으로 파일을 불러옴.
}
catch (error) {
    console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
    fs_1.default.mkdirSync("uploads"); // 없으면 폴더 만들기.   mkdirSync: Directory 생성.
}
const upload = (0, multer_1.default)({
    // nmulter 설정.
    storage: multer_1.default.diskStorage({
        // 어디에 저장할 것인가, 우리는 사용자가 업로드한 것을 disk에 저장한다.
        destination(req, file, done) {
            done(null, "uploads"); // 생성한 uploads폴더에 저장.
        },
        filename(req, file, done) {
            // 파일 이름 설정
            const ext = path_1.default.extname(file.originalname);
            // 확장자 추출.  이미지.png -> 이미지2023090234.png = 이미지+날짜스트링.png
            done(null, path_1.default.basename(file.originalname, ext) + Date.now() + ext);
            // 파일명에 확장자를 분리 시킨뒤 사이에 날짜를 넣고 다시 확장자를 넣어 줌.
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 파일 사이즈 5mg bite가 작을수도 있으니 변경 가능.
});
router.post("/", middlewares_1.isLoggedIn, upload.none(), // onSubmit의 formData
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashtags = req.body.content.match(/#[^\s#]+/g);
        const post = yield models_1.Post.create({
            content: req.body.content,
            UserId: parseInt(req.body.userId, 10),
        });
        if (hashtags) {
            const result = yield Promise.all(hashtags.map((tag) => models_1.Hashtag.findOrCreate({
                where: { title: tag.slice(1).toLowerCase() },
            }))); // [[월요일, 화요일], [수요일, 목요일]] 이렇게 배열이므로 map 사용.
            yield post.addHashtags(result.map((v) => v[0]));
        }
        if (req.body.image) {
            if (Array.isArray(req.body.image)) {
                // 이미지를 여러 개 올리면 image: [aa.png, bb.png]
                const images = yield Promise.all(
                // 파일들이 전부 Promise이므로, Promise.all 을 사용하면 한번에 두개가 저장됨.
                req.body.image.map((image) => models_1.Image.create({ src: image })));
                yield post.addImages(images);
            }
            else {
                // 이미지를 하나만 올리면 image: aa.png
                const image = yield models_1.Image.create({ src: req.body.image });
                yield post.addImages([image]);
            }
        }
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
        console.log("fullPost확인", fullPost);
        res.status(201).json(fullPost); // 프론트로 돌려주기. 그럼 reducer에 response에 들어간다.
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
router.post("/images", middlewares_1.isLoggedIn, upload.array("image"), (req, res, next) => {
    // front의 input name "image"와 array 동일, 한 장만 업로드하면 single
    // POST /post/images
    console.log(req.files);
    if (req.files) {
        res.json(req.files.map((v) => v.filename));
    }
    else {
        res.status(400).json({ error: "No files provided." });
    }
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
router.post("/:postId/retweet", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    // POST /post/1/retweet
    try {
        const post = yield models_1.Post.findOne({
            where: { id: req.params.postId },
            include: [
                {
                    model: models_1.Post,
                    as: "Retweet",
                },
            ],
        });
        if (!post) {
            return res.status(403).send("존재하지 않는 게시글입니다.");
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) === post.UserId ||
            (post.Retweet && post.Retweet.UserId === ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id))) {
            return res.status(403).send("자신의 글은 리트윗할 수 없습니다.");
        }
        const retweetTargetId = post.RetweetId || post.id; // 리트윗한 게시글을 찾아보고, RetweetId 사용하거나 post.id를 사용.
        const exPost = yield models_1.Post.findOne({
            where: {
                UserId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id,
                RetweetId: retweetTargetId,
            },
        });
        if (exPost) {
            return res.status(403).send("이미 리트윗했습니다.");
        }
        const retweet = yield models_1.Post.create({
            UserId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id, // 클라이언트에서 제공하는 userId 대신에 서버에서 가져온 현재 사용자의 ID를 사용.
            RetweetId: retweetTargetId,
            content: "Retweet", //  allowNull: false이므로 무조껀 넣음.
        });
        const retweetWithPrevPost = yield models_1.Post.findOne({
            where: { id: retweet.id },
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
                    model: models_1.User, // 좋아요 누른 사람
                    as: "Likers",
                    attributes: ["id"],
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
            ],
        });
        return res.status(201).json(retweetWithPrevPost);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post("/:postId/comment", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
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
            UserId: ((_e = req.user) === null || _e === void 0 ? void 0 : _e.id) || 0,
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
router.patch("/:postId", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    // PATCH /post/10
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    try {
        yield models_1.Post.update({
            content: req.body.content,
        }, {
            where: {
                id: req.params.postId,
                UserId: (_f = req.user) === null || _f === void 0 ? void 0 : _f.id, // 내가 내글 삭제
            },
        });
        const post = yield models_1.Post.findOne({ where: { id: req.params.postId } });
        if (hashtags) {
            const result = yield Promise.all(hashtags.map((tag) => models_1.Hashtag.findOrCreate({
                where: { title: tag.slice(1).toLowerCase() },
            }))); // [[노드, true], [리액트, true]]
            yield (post === null || post === void 0 ? void 0 : post.setHashtags(result.map((v) => v[0])));
        }
        res.status(200).json({
            PostId: parseInt(req.params.postId, 10),
            content: req.body.content,
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.delete("/:postId", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _g;
    // DELETE /post/10
    try {
        yield models_1.Post.destroy({
            where: {
                id: req.params.postId,
                UserId: (_g = req.user) === null || _g === void 0 ? void 0 : _g.id,
            },
        });
        res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
