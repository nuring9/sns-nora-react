"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importStar(require("sequelize"));
const user_1 = __importDefault(require("./user"));
const hashtag_1 = __importDefault(require("./hashtag"));
const commend_1 = __importDefault(require("./commend"));
const image_1 = __importDefault(require("./image"));
class Post extends sequelize_1.Model {
    static initiate(sequelize) {
        Post.init({
            id: {
                type: sequelize_1.default.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            content: {
                type: sequelize_1.default.STRING(140),
                allowNull: false,
            },
            img: {
                type: sequelize_1.default.STRING(200),
                allowNull: true,
            },
            createdAt: sequelize_1.default.DATE,
            updatedAt: sequelize_1.default.DATE,
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: "Post",
            tableName: "posts",
            paranoid: false,
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
        });
    }
    static associate() {
        Post.belongsTo(user_1.default);
        Post.hasMany(commend_1.default);
        Post.hasMany(image_1.default);
        Post.belongsToMany(hashtag_1.default, { through: "PostHashtag" });
        Post.belongsToMany(user_1.default, { through: "Like", as: "Likers" });
        Post.belongsTo(Post, { as: "Retweet" });
    }
}
exports.default = Post;
