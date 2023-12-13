const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
// const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const { createProxyMiddleware } = require("http-proxy-middleware");

dotenv.config();
// const pageRouter = require("./routes/page");

const app = express();
app.set("port", process.env.PORT || 8001);
app.use(express.static(path.join(__dirname, "../front/build")));
// app.set("view engine", "html");
const reactDevServer = "http://localhost:3000";
// nunjucks.configure("views", {
//   express: app,
//   watch: true,
// });

app.use(morgan("dev"));
// React 개발 서버로 요청을 프록시
app.use(
  "/api", // 프론트에서 요청하는 API 경로 설정
  createProxyMiddleware({
    target: reactDevServer,
    changeOrigin: true,
  })
);

// app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

// app.use("/", pageRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/build/index.html"));
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
