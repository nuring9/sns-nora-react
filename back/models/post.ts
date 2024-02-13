import Sequelize, {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
  ForeignKey,
  BelongsToManyAddAssociationsMixin,
  BelongsToManyRemoveAssociationsMixin,
} from "sequelize";
import User from "./user";
import Hashtag from "./hashtag";
import Comment from "./commend";
import Image from "./image";

class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>;
  declare content: string;
  declare img: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare UserId: ForeignKey<User["id"]>;
  declare addHashtags: BelongsToManyAddAssociationsMixin<Hashtag, number>;
  declare addLikers: BelongsToManyAddAssociationsMixin<User, number>;
  declare removeLikers: BelongsToManyRemoveAssociationsMixin<User, number>;
  declare addImages: BelongsToManyAddAssociationsMixin<Image, number>;
  declare setHashtags: BelongsToManyAddAssociationsMixin<Hashtag, number>;

  static initiate(sequelize: Sequelize.Sequelize) {
    Post.init(
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        content: {
          type: Sequelize.STRING(140),
          allowNull: false,
        },
        img: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: "Post",
        tableName: "posts",
        paranoid: false,
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate() {
    Post.belongsTo(User);
    Post.hasMany(Comment);
    Post.hasMany(Image);
    Post.belongsToMany(Hashtag, { through: "PostHashtag" });
    Post.belongsToMany(User, { through: "Like", as: "Likers" }); // post.addLikers, post.removeLikers 생성
    Post.belongsTo(Post, { as: "Retweet" });
  }
}

export default Post;
