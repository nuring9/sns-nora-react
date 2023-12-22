import express from "express";
import bcrypt from "bcrypt";
import { User, Post } from "../models";
import passport from "passport";
import { Request, Response } from "express";

const router = express.Router();

router.post("/login", async (req, res, next) => {
  // POST /user/login
  passport.authenticate("local", (err: Request, user: Response, info: any) => {
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
      // const fullUserWithoutPassword = await User.findOne({
      //   where: { id: user.id },
      //   attributes: {
      //     exclude: ["password"],
      //   },
      //   include: [
      //     {
      //       model: Post,
      //       attributes: ["id"],
      //     },
      //     {
      //       model: User,
      //       as: "Followings",
      //       attributes: ["id"],
      //     },
      //     {
      //       model: User,
      //       as: "Followers",
      //       attributes: ["id"],
      //     },
      //   ],
      // });
      return res.status(200).json(user);
    });
  })(req, res, next);
});

router.post("/signup", async (req, res, next) => {
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

export default router;
