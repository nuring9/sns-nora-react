// types/index.ts

export interface User {
  id?: number | undefined;
  email?: string;
  password?: string;
  nickname?: string;
}

export interface Image {
  src: string;
  User: User | undefined;
}

export interface Comment {
  User: User | undefined;
  content?: string;
  userId?: number;
}

export interface LikersType {
  id: number;
}

export interface Post {
  id: number;
  email?: string;
  User: User;
  content?: string;
  createdAt: number;
  Images?: Image[];
  Comments: Comment[];
  Likers?: LikersType[] | null;
}

export interface Posts extends Post {
  text: string;
}

export interface PostText {
  content?: string;
  userId?: number | undefined;
  id?: number;
}

export interface CommentDataType {
  content?: string;
  postId?: number;
  userId?: number | undefined;
}

export interface PostId {
  postId?: number | undefined;
  userId?: number | undefined;
}
