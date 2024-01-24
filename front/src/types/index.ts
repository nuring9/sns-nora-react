// types/index.ts

export interface User {
  id?: number;
  email?: string;
  password?: string;
  nickname?: string;
  nick?: string;
}

export interface Image {
  src: string;
  User: User;
}

export interface Comment {
  User: User;
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
  nick?: string;
}

export interface Posts extends Post {
  text: string;
}

export interface PostText {
  content?: string;
  userId?: number;
  id?: number;
}

export interface CommentDataType {
  content?: string;
  postId?: number;
  userId?: number;
}

export interface UpdatePostDataType {
  content?: string;
  postId?: number;
}

export interface PostId {
  postId?: number;
  userId?: number;
}

export interface FollowersType {
  postId?: number;
  id?: number;
  userId?: number;
}
