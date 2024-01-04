"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const local_1 = __importDefault(require("./local"));
const models_1 = require("../models");
exports.default = () => {
    passport_1.default.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport_1.default.deserializeUser((id, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield models_1.User.findOne({ where: { id } });
            done(null, user); // req.user
        }
        catch (err) {
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
    }));
    (0, local_1.default)();
};
