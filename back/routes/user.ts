import express from "express";
import bcrypt from "bcrypt";
import { User, Post, Image, Comment } from "../models";
import { isLoggedIn, isNotLoggedIn } from "./middlewares";
import passport from "passport";
import { Request } from "express";
import { Op, InferAttributes } from "sequelize";

const router = express.Router();

interface PassportUser {
  id: number;
  email: string;
  nick: string;
}

interface UserData extends InferAttributes<User> {
  id: number;
  email: string;
  nick: string;
  Posts?: any[]; // 포스트 배열
  Followers?: any[]; // 팔로워 배열
  Followings?: any[]; // 팔로우 배열
}

router.get("/", async (req, res, next) => {
  // GET /user
  try {
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

router.get("/followers", isLoggedIn, async (req, res, next) => {
  // GET /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user?.id } });
    if (!user) {
      res.status(403).send("존재하지 않는 사용자");
    }

    // req.query.limit가 undefined일 때의 경우를 처리
    let limit: number | undefined = 3; // 기본 값으로 3을 설정
    if (typeof req.query.limit === "string") {
      // 문자열인 경우에만 숫자로 변환
      limit = parseInt(req.query.limit, 10);
    }

    const followers = await user?.getFollowers({
      limit: limit,
    });
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/followings", isLoggedIn, async (req, res, next) => {
  // GET /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user?.id } });
    if (!user) {
      res.status(403).send("존재하지 않는 사용자");
    }

    // req.query.limit가 undefined일 때의 경우를 처리
    let limit: number | undefined = 3; // 기본 값으로 3을 설정
    if (typeof req.query.limit === "string") {
      // 문자열인 경우에만 숫자로 변환
      limit = parseInt(req.query.limit, 10);
    }

    const followings = await user?.getFollowings({
      limit: limit,
    });
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  // GET /user/1
  try {
    console.log("req.user확인", req.user);
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

    console.log(`풀유저`, fullUserWithoutPassword);
    if (fullUserWithoutPassword) {
      const data = fullUserWithoutPassword.toJSON() as UserData;
      data.Posts = (data as any).Posts?.length; // 개인정보 침해 예방
      data.Followers = (data as any).Followers?.length;
      data.Followings = (data as any).Followings?.length;
      res.status(200).json(data);
    } else {
      res.status(404).json("존재하지 않는 사용자입니다.");
    }
    // res.status(200).json(fullUserWithoutPassword);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

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

router.get("/:userId/posts", async (req, res, next) => {
  // GET /user/1/posts
  try {
    const lastId: number | undefined = parseInt(
      req.query.lastId?.toString() || "0",
      10
    );
    const where: { UserId: string; id?: any } = {
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
      where.id = { [Op.lt]: lastId };
      console.log(lastId, "라스트아이디");
    }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
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
      //수정
      {
        nick: req.body.nickname, // front에서 제공
      },
      {
        where: { id: req.user?.id }, // 조건, 내 아이디 수정
      }
    );
    res.status(200).json({ nick: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
