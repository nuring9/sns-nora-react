// types/index.ts

export interface User {
  id?: number;
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
}

export interface Post {
  id: number;
  email?: string;
  User: User;
  content?: string;
  createdAt: number;
  Images?: Image[];
  Comments: Comment[];
  // addImages?: any;
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
  userId: number;
  id?: number;
}
