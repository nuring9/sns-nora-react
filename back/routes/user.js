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
const router = express_1.default.Router();
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
                        attributes: ["id"],
                    },
                    {
                        model: models_1.User,
                        as: "Followers",
                        attributes: ["id"],
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
                        attributes: ["id"],
                    },
                    {
                        model: models_1.User,
                        as: "Followers",
                        attributes: ["id"],
                    },
                ],
            });
            return res.status(200).json(user);
        }));
    })(req, res, next);
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
exports.default = router;
