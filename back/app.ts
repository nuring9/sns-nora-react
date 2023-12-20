import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import session from "express-session";

import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
import postRouter from "./routes/post";
import { sequelize } from "./models";

const app = express();
app.set("port", process.env.PORT || 8001);
// app.set("view engine", "html");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });
// 시퀄라이즈 연결

app.use(morgan("dev"));
// React 개발 서버로 요청을 프록시
app.use(express.static(path.join(__dirname, "../front/build")));
const reactDevServer = "http://localhost:3000";
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
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use("/", postRouter);

app.use((req, res, next) => {
  const error: any = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  // error.status = 404;
  error.status = 404;
  next(error);
});

interface CustomError extends Error {
  status?: number;
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");

  return;
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/build/index.html"));
}); // 메인페이지 라우팅

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});

export default app;
