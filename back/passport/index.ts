import passport from "passport";
import local from "./local";
import { User } from "../models";

interface UserType {
  id?: number;
  email?: string;
  password?: string;
  nick?: string;
}

export default () => {
  passport.serializeUser((user: UserType, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await User.findOne({ where: { id } });
      done(null, user); // req.user
    } catch (err) {
      console.error(err);
      done(err);
    }
    // User.findOne({
    //   where: { id },
    //   include: [
    //     {
    //       model: User,
    //       attributes: ["id", "nick"],
    //       as: "Followers",
    //     },
    //     {
    //       model: User,
    //       attributes: ["id", "nick"],
    //       as: "Followings",
    //     },
    //   ],
    // })
    //   .then((user) => done(null, user))
    //   .catch((err) => done(err));
  });

  local();
};
