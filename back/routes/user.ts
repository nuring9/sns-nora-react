import express from "express";
import bcrypt from "bcrypt";
import { User, Post, Image, Comment } from "../models";
import { isLoggedIn, isNotLoggedIn } from "./middlewares";
import passport from "passport";
import { Request, Response } from "express";
import { Op } from "sequelize";

const router = express.Router();

interface PassportUser {
  id: number;
  email: string;
  nick: string;
}

router.get("/", async (req, res, next) => {
  // GET /user
  try {
    console.log("req.user", req.user);
    if (req.user) {
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id", "nick"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id", "nick"],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword); // 사용자가 있으면 보내주고,
    } else {
      res.status(200).json(null); // 없으면 아무것도 보내주지 않으면 됨.
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

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
              attributes: ["id", "nick"],
            },
            {
              model: User,
              as: "Followers",
              attributes: ["id", "nick"],
            },
          ],
        });
        return res.status(200).json(user);
      });
    }
  )(req, res, next);
});

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

router.get("/:userId", async (req, res, next) => {
  // GET /user/1
  try {
    const fullUserWithoutPassword = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Post,
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id", "nick"],
        },
        {
          model: User,
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
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId/posts", async (req, res, next) => {
  // GET /user/1/posts
  try {
    const where: { UserId: string; id?: { [Op.lt]: number } } = {
      UserId: req.params.userId,
    };
    if (req.query.lastId) {
      // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId as string, 10) || 0 };
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "nick"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nick"],
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nick"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 팔로우하려고 하시네요?");
    }
    if (req.user) {
      await user?.addFollowers([req.user.id]);
      res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  // DELETE /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 언팔로우하려고 하시네요?");
    }
    if (req.user) {
      await user?.removeFollowers([req.user.id]);
      res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  // DELETE /user/follower/2
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      res.status(403).send("없는 사람을 차단하려고 하시네요?");
    }
    if (req.user) {
      await user?.removeFollowings([req.user.id]);
      res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
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

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nick: req.body.nickname,
      },
      {
        where: { id: req.user?.id },
      }
    );
    res.status(200).json({ nick: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
