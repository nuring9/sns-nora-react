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
const passport_local_1 = require("passport-local");
const bcrypt_1 = __importDefault(require("bcrypt"));
const models_1 = require("../models");
exports.default = () => {
    passport_1.default.use(new passport_local_1.Strategy({
        usernameField: "email",
        passwordField: "password",
    }, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const exUser = yield models_1.User.findOne({ where: { email } }); // 존재하는 사용자를 찾음
            if (exUser) {
                const result = yield bcrypt_1.default.compare(password, exUser.password); // 비밀번호 비교
                if (result) {
                    done(null, exUser); // 로그인 성공
                }
                else {
                    done(null, false, { message: "비밀번호가 일치하지 않습니다." });
                }
            }
            else {
                done(null, false, { message: "가입되지 않은 회원입니다." });
            }
        }
        catch (error) {
            console.error(error);
            done(error);
        }
    })));
};
