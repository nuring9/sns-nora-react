import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import cors from "cors";

import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

dotenv.config();
import postRouter from "./routes/post";
import userRouter from "./routes/user";
import { sequelize } from "./models";

const app = express();
app.set("port", process.env.PORT || 8000);
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
app.use(
  cors({
    origin: "*", // 추후 배포 도메인변경
    credentials: true, // 추후 배포 후 true로 변경
  })
);
// CORS 문제 해결하기

// app.use(express.static(path.join(__dirname, "public")));
app.use(express.json()); // front에서 넘어오는 데이터
app.use(express.urlencoded({ extended: true })); // front의 form submit에서  넘어오는 데이터

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

// app.use("/", pageRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

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

const reactDevServer = "http://localhost:3000";
app.use(
  "/", // 프론트에서 요청하는 API 경로 설정
  createProxyMiddleware({
    target: reactDevServer,
    changeOrigin: true,
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/build/index.html"));
}); // 메인페이지 라우팅

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});

export default app;
