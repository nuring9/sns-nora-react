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
const http_proxy_middleware_1 = require("http-proxy-middleware");
const post_1 = __importDefault(require("./routes/post"));
const user_1 = __importDefault(require("./routes/user"));
// import pageRouter from "./routes/page";
const models_1 = require("./models");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, passport_2.default)(); // 패스포트 설정
app.set("port", process.env.PORT || 8000);
// app.set("view engine", "html");
models_1.sequelize
    .sync({ force: false })
    .then(() => {
    console.log("데이터베이스 연결 성공");
})
    .catch((err) => {
    console.error(err);
});
// 시퀄라이즈 연결
app.use((0, morgan_1.default)("dev"));
// React 개발 서버로 요청을 프록시
app.use(express_1.default.static(path_1.default.join(__dirname, "../front/build")));
app.use((0, cors_1.default)({
    origin: "*", // 추후 배포 도메인변경
    credentials: true, // 추후 배포 후 true로 변경
}));
// CORS 문제 해결하기
// app.use(express.static(path.join(__dirname, "public")));
app.use(express_1.default.json()); // front에서 넘어오는 데이터
app.use(express_1.default.urlencoded({ extended: true })); // front의 form submit에서  넘어오는 데이터
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
app.use((0, express_session_1.default)({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// app.use("/", pageRouter);
app.use("/post", post_1.default);
app.use("/user", user_1.default);
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    // error.status = 404;
    error.status = 404;
    next(error);
});
const reactDevServer = "http://localhost:3000";
app.use("/", // 프론트에서 요청하는 API 경로 설정
(0, http_proxy_middleware_1.createProxyMiddleware)({
    target: reactDevServer,
    changeOrigin: true,
}));
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
    res.status(err.status || 500);
    res.render("error");
    return;
});
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../front/build/index.html"));
}); // 메인페이지 라우팅
app.listen(app.get("port"), () => {
    console.log(app.get("port"), "번 포트에서 대기 중");
});
exports.default = app;
