import express from "express";
import bcrypt from "bcrypt";
import { User, Post } from "../models";
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
import passport from "passport";
import { Request, Response } from "express";

const router = express.Router();

interface PassportUser {
  id: number;
}

router.post("/login", isNotLoggedIn, async (req, res, next) => {
  // POST /user/login
  passport.authenticate(
    "local",
    (err: Request, user: PassportUser, info: any) => {
      // user: Response 냐중에 수정
      if (err) {
        // 비밀번호 에러
        console.error(err);
        return next(err);
      }
      if (info) {
        return res.status(401).send(info.message);
      }
      return req.login(user, async (loginErr) => {
        if (loginErr) {
          // 패스포트 라이브러리 로그인 에러
          console.error(loginErr);
          return next(loginErr);
        }
        const fullUserWithoutPassword = await User.findOne({
          where: { id: user.id },
          attributes: {
            exclude: ["password"],
            // 전체 데이터에서 비밀번호만 제외 후 가져옴.
          },
          include: [
            {
              model: Post,
              attributes: ["id"],
            },
            {
              model: User,
              as: "Followings",
              attributes: ["id"],
            },
            {
              model: User,
              as: "Followers",
              attributes: ["id"],
            },
          ],
        });
        return res.status(200).json(user);
      });
    }
  )(req, res, next);
});

router.post("/signup", isNotLoggedIn, async (req, res, next) => {
  // POST /user/signup
  try {
    const exUser = await User.findOne({
      // 기존 사용자 찾기
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용 중인 아이디입니다.");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12); // 비밀번호 보안
    await User.create({
      email: req.body.email,
      nick: req.body.nickname,
      password: hashedPassword,
    });
    res.status(201).send("ok");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/logout", isLoggedIn, (req, res) => {
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

export default router;
