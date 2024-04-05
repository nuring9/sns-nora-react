"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = __importDefault(require("./passport"));
const posts_1 = __importDefault(require("./routes/posts"));
const post_1 = __importDefault(require("./routes/post"));
const user_1 = __importDefault(require("./routes/user"));
const hashtag_1 = __importDefault(require("./routes/hashtag"));
// import pageRouter from "./routes/page";
const models_1 = require("./models");
const hpp_1 = __importDefault(require("hpp"));
const helmet_1 = __importDefault(require("helmet"));
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, passport_2.default)(); // 패스포트 설정
app.set("port", process.env.PORT || 8000);
if (process.env.NODE_ENV === "production") {
    app.use((0, morgan_1.default)("combined"));
    app.use((0, hpp_1.default)());
    app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
    app.use((0, cors_1.default)({
        origin: "http://snsnora.store", // 프론트 도메인
        credentials: true,
    }));
}
else {
    app.use((0, morgan_1.default)("dev"));
    app.use((0, cors_1.default)({
        origin: true,
        credentials: true,
    }));
}
models_1.sequelize
    .sync({ force: false })
    .then(() => {
    console.log("데이터베이스 연결 성공");
})
    .catch((err) => {
    console.error(err);
});
app.use(express_1.default.static(path_1.default.join(__dirname, "../front/build"))); // 뷰엔진 대신 react프로젝트 연결 (__dirname: 현재폴더)
app.use("/", express_1.default.static(path_1.default.join(__dirname, "uploads")));
// express가 uploads폴더를 front에 제공함.  (__dirname: 현재폴더), "/"는 localhosts:8000 뒤의 /가 됨.
app.use(express_1.default.json()); // front에서 넘어오는 데이터
app.use(express_1.default.urlencoded({ extended: true })); // front의 form submit에서  넘어오는 데이터
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false, // 추후 https를 사용할 때 true로 변경.
        domain: process.env.NODE_ENV === "production" ? ".snsnora.store" : undefined, // .을 사용해야 api.snsnora.store랑 snsnora.store랑 쿠기가 공유된다.
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// app.use("/", pageRouter);
app.use("/posts", posts_1.default); // 순서 중요. 게시글들 불러오니 먼저
app.use("/post", post_1.default);
app.use("/user", user_1.default);
app.use("/hashtag", hashtag_1.default);
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "../front/build/index.html"));
// }); // 메인페이지 라우팅
app.get("/", (req, res) => {
    res.send("Express 성공");
}); // 메인페이지 라우팅
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    // error.status = 404;
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    res.status(err.status || 500).send({ error: err.message }); // 에러 메시지를 응답으로 보냄
    return;
});
app.listen(app.get("port"), () => {
    console.log(app.get("port"), "서버 실행 중!");
});
// app.listen(8000, () => {
//   console.log("서버 실행 중!");
// });
exports.default = app;
