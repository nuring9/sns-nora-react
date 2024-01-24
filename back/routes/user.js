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
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models");
const middlewares_1 = require("./middlewares");
const passport_1 = __importDefault(require("passport"));
const sequelize_1 = require("sequelize");
const router = express_1.default.Router();
// interface UserResponse {
//   id: number;
//   email: string;
//   nick: string;
//   Posts?: number; // Assuming Posts is an array in your Sequelize model
//   Followers?: number;
//   Followings?: number;
// }
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // GET /user
    try {
        console.log("req.user", req.user);
        if (req.user) {
            const fullUserWithoutPassword = yield models_1.User.findOne({
                where: { id: req.user.id },
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: models_1.Post,
                        attributes: ["id"],
                    },
                    {
                        model: models_1.User,
                        as: "Followings",
                        attributes: ["id", "nick"],
                    },
                    {
                        model: models_1.User,
                        as: "Followers",
                        attributes: ["id", "nick"],
                    },
                ],
            });
            res.status(200).json(fullUserWithoutPassword); // 사용자가 있으면 보내주고,
        }
        else {
            res.status(200).json(null); // 없으면 아무것도 보내주지 않으면 됨.
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post("/login", middlewares_1.isNotLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // POST /user/login
    passport_1.default.authenticate("local", (err, user, info) => {
        // user: Response 냐중에 수정
        if (err) {
            // 비밀번호 에러
            console.error(err);
            return next(err);
        }
        if (info) {
            return res.status(401).send(info.message);
        }
        return req.login(user, (loginErr) => __awaiter(void 0, void 0, void 0, function* () {
            if (loginErr) {
                // 패스포트 라이브러리 로그인 에러
                console.error(loginErr);
                return next(loginErr);
            }
            const fullUserWithoutPassword = yield models_1.User.findOne({
                where: { id: user.id },
                attributes: {
                    exclude: ["password"],
                    // 전체 데이터에서 비밀번호만 제외 후 가져옴.
                },
                include: [
                    {
                        model: models_1.Post,
                        attributes: ["id"],
                    },
                    {
                        model: models_1.User,
                        as: "Followings",
                        attributes: ["id", "nick"],
                    },
                    {
                        model: models_1.User,
                        as: "Followers",
                        attributes: ["id", "nick"],
                    },
                ],
            });
            return res.status(200).json(user);
        }));
    })(req, res, next);
}));
// router.get("/followers", isLoggedIn, async (req, res, next) => {
//   // GET /user/followers
//   try {
//     const user = await User.findOne({ where: { id: req.user?.id } });
//     if (!user) {
//       res.status(403).send("없는 사람을 찾으려고 하시네요?");
//     }
//     const followers = await user?.getFollowers({
//       limit: parseInt(req.query.limit, 10),
//     });
//     res.status(200).json(followers);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });
// router.get("/followings", isLoggedIn, async (req, res, next) => {
//   // GET /user/followings
//   try {
//     const user = await User.findOne({ where: { id: req.user?.id } });
//     if (!user) {
//       res.status(403).send("없는 사람을 찾으려고 하시네요?");
//     }
//     const followings = await user.getFollowings({
//       limit: parseInt(req.query.limit, 10),
//     });
//     res.status(200).json(followings);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });
router.get("/:userId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // GET /user/1
    try {
        const fullUserWithoutPassword = yield models_1.User.findOne({
            where: { id: req.params.userId },
            attributes: {
                exclude: ["password"],
            },
            include: [
                {
                    model: models_1.Post,
                    attributes: ["id"],
                },
                {
                    model: models_1.User,
                    as: "Followings",
                    attributes: ["id", "nick"],
                },
                {
                    model: models_1.User,
                    as: "Followers",
                    attributes: ["id", "nick"],
                },
            ],
        });
        // if (fullUserWithoutPassword) {
        //   const data: UserResponse = fullUserWithoutPassword.toJSON();
        //   data.Posts = data.Posts?.length; // 개인정보 침해 예방
        //   data.Followers = data.Followers?.length;
        //   data.Followings = data.Followings?.length;
        //   res.status(200).json(data);
        // } else {
        //   res.status(404).json("존재하지 않는 사용자입니다.");
        // }
        res.status(200).json(fullUserWithoutPassword);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.get("/:userId/posts", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // GET /user/1/posts
    try {
        const where = {
            UserId: req.params.userId,
        };
        if (req.query.lastId) {
            // 초기 로딩이 아닐 때
            where.id = { [sequelize_1.Op.lt]: parseInt(req.query.lastId, 10) || 0 };
        }
        const posts = yield models_1.Post.findAll({
            where,
            limit: 10,
            order: [["createdAt", "DESC"]],
            include: [
                {
                    model: models_1.User,
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
                            attributes: ["id", "nickname"],
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
router.patch("/:userId/follow", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // PATCH /user/1/follow
    try {
        const user = yield models_1.User.findOne({ where: { id: req.params.userId } });
        if (!user) {
            res.status(403).send("없는 사람을 팔로우하려고 하시네요?");
        }
        if (req.user) {
            yield (user === null || user === void 0 ? void 0 : user.addFollowers([req.user.id]));
            res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.delete("/:userId/follow", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // DELETE /user/1/follow
    try {
        const user = yield models_1.User.findOne({ where: { id: req.params.userId } });
        if (!user) {
            res.status(403).send("없는 사람을 언팔로우하려고 하시네요?");
        }
        if (req.user) {
            yield (user === null || user === void 0 ? void 0 : user.removeFollowers([req.user.id]));
            res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.delete("/follower/:userId", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // DELETE /user/follower/2
    try {
        const user = yield models_1.User.findOne({ where: { id: req.params.userId } });
        if (!user) {
            res.status(403).send("없는 사람을 차단하려고 하시네요?");
        }
        if (req.user) {
            yield (user === null || user === void 0 ? void 0 : user.removeFollowings([req.user.id]));
            res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
        }
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.post("/signup", middlewares_1.isNotLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // POST /user/signup
    try {
        const exUser = yield models_1.User.findOne({
            // 기존 사용자 찾기
            where: {
                email: req.body.email,
            },
        });
        if (exUser) {
            return res.status(403).send("이미 사용 중인 아이디입니다.");
        }
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 12); // 비밀번호 보안
        yield models_1.User.create({
            email: req.body.email,
            nick: req.body.nickname,
            password: hashedPassword,
        });
        res.status(201).send("ok");
    }
    catch (err) {
        console.error(err);
        next(err);
    }
}));
router.post("/logout", middlewares_1.isLoggedIn, (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("로그아웃 에러");
        }
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("세션 삭제 에러");
            }
            res.send("ok");
        });
    });
});
router.patch("/nickname", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        yield models_1.User.update({
            nick: req.body.nickname,
        }, {
            where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
        });
        res.status(200).json({ nick: req.body.nickname });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
