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
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // GET /user
    try {
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
router.get("/followers", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // GET /user/followers
    try {
        const user = yield models_1.User.findOne({ where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id } });
        if (!user) {
            res.status(403).send("존재하지 않는 사용자");
        }
        // req.query.limit가 undefined일 때의 경우를 처리
        let limit = 3; // 기본 값으로 3을 설정
        if (typeof req.query.limit === "string") {
            // 문자열인 경우에만 숫자로 변환
            limit = parseInt(req.query.limit, 10);
        }
        const followers = yield (user === null || user === void 0 ? void 0 : user.getFollowers({
            limit: limit,
        }));
        res.status(200).json(followers);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.get("/followings", middlewares_1.isLoggedIn, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    // GET /user/followings
    try {
        const user = yield models_1.User.findOne({ where: { id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id } });
        if (!user) {
            res.status(403).send("존재하지 않는 사용자");
        }
        // req.query.limit가 undefined일 때의 경우를 처리
        let limit = 3; // 기본 값으로 3을 설정
        if (typeof req.query.limit === "string") {
            // 문자열인 경우에만 숫자로 변환
            limit = parseInt(req.query.limit, 10);
        }
        const followings = yield (user === null || user === void 0 ? void 0 : user.getFollowings({
            limit: limit,
        }));
        res.status(200).json(followings);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
router.get("/:userId", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d, _e;
    // GET /user/1
    try {
        console.log("req.user확인", req.user);
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
        console.log(`풀유저`, fullUserWithoutPassword);
        if (fullUserWithoutPassword) {
            const data = fullUserWithoutPassword.toJSON();
            data.Posts = (_c = data.Posts) === null || _c === void 0 ? void 0 : _c.length; // 개인정보 침해 예방
            data.Followers = (_d = data.Followers) === null || _d === void 0 ? void 0 : _d.length;
            data.Followings = (_e = data.Followings) === null || _e === void 0 ? void 0 : _e.length;
            res.status(200).json(data);
        }
        else {
            res.status(404).json("존재하지 않는 사용자입니다.");
        }
        // res.status(200).json(fullUserWithoutPassword);
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
// //로그인유저 팔로우 팔로워
// router.get("/:userId/followers", isLoggedIn, async (req, res, next) => {
//   // GET /user/id/followers
//   try {
//     console.log("req.user확인임", req.user);
//     const user = await User.findOne({
//       where: { id: req.params.userId },
//       include: [
//         {
//           model: Post,
//           attributes: ["id"],
//         },
//         {
//           model: User,
//           as: "Followings",
//           attributes: ["id", "nick"],
//         },
//         {
//           model: User,
//           as: "Followers",
//           attributes: ["id", "nick"],
//         },
//       ],
//     });
//     res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });
// router.get("/:userId/followings", isLoggedIn, async (req, res, next) => {
//   // GET /user/id/followings
//   try {
//     const where: { UserId: string; id?: any } = {
//       UserId: req.params.userId,
//     };
//     const user = await User.findOne({
//       include: [
//         {
//           model: Post,
//           attributes: ["id"],
//         },
//         {
//           model: User,
//           as: "Followings",
//           attributes: ["id", "nick"],
//         },
//         {
//           model: User,
//           as: "Followers",
//           attributes: ["id", "nick"],
//         },
//       ],
//     });
//     // const user = await User.findOne({
//     //   where:{ UserId: string; id?: any }= {   UserId: req.params.userId, },
//     //   include: [
//     //     {
//     //       model: Post,
//     //       attributes: ["id"],
//     //     },
//     //     {
//     //       model: User,
//     //       as: "Followings",
//     //       attributes: ["id", "nick"],
//     //     },
//     //     {
//     //       model: User,
//     //       as: "Followers",
//     //       attributes: ["id", "nick"],
//     //     },
//     //   ],
//     // });
//     res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// });
router.get("/:userId/posts", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _f;
    // GET /user/1/posts
    try {
        const lastId = parseInt(((_f = req.query.lastId) === null || _f === void 0 ? void 0 : _f.toString()) || "0", 10);
        const where = {
            UserId: req.params.userId,
        };
        console.log("req!!!", req.user);
        // if (req.query.lastId) {
        //   // 초기 로딩이 아닐 때
        //   where.id = { [Op.lt]: lastId };
        // }
        if (!isNaN(lastId) && lastId > 0) {
            // 초기 로딩이 아닐 때, && lastId가 0보다 큰 경우에만 where.id 조건이 추가.
            // 이렇게 해야 실행된다.
            where.id = { [sequelize_1.Op.lt]: lastId };
            console.log(lastId, "라스트아이디");
        }
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
    var _g;
    try {
        yield models_1.User.update(
        //수정
        {
            nick: req.body.nickname, // front에서 제공
        }, {
            where: { id: (_g = req.user) === null || _g === void 0 ? void 0 : _g.id }, // 조건, 내 아이디 수정
        });
        res.status(200).json({ nick: req.body.nickname });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
}));
exports.default = router;
