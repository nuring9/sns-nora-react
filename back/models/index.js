"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = exports.Comment = exports.Hashtag = exports.Post = exports.User = exports.sequelize = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const config_1 = __importDefault(require("../config/config"));
const user_1 = __importDefault(require("./user"));
exports.User = user_1.default;
const post_1 = __importDefault(require("./post"));
exports.Post = post_1.default;
const hashtag_1 = __importDefault(require("./hashtag"));
exports.Hashtag = hashtag_1.default;
const image_1 = __importDefault(require("./image"));
exports.Image = image_1.default;
const commend_1 = __importDefault(require("./commend"));
exports.Comment = commend_1.default;
const env = process.env.NODE_ENV || "development"; // 환경변수 설정. 배포일때는 production, 개발용은 development
const config = config_1.default[env]; // config.ts를 가져와 env를 적용함.
exports.sequelize = new sequelize_1.default.Sequelize(config.database, config.username, config.password, config);
// config에서 가져옴. 즉, 시퀄라이즈가 노드와 mysql을 연결해준다.(시퀄라이즈가 mysql2 드라이버에 설정 정보를 보내줘서 노드와 mysql연결을 도와줌.)
user_1.default.initiate(exports.sequelize);
post_1.default.initiate(exports.sequelize);
hashtag_1.default.initiate(exports.sequelize);
commend_1.default.initiate(exports.sequelize);
image_1.default.initiate(exports.sequelize);
user_1.default.associate();
post_1.default.associate();
hashtag_1.default.associate();
commend_1.default.associate();
image_1.default.associate();
