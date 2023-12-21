// types/index.ts

export interface User {
  id?: number;
  email?: string;
  password?: string;
  nickname?: string;
}

export interface Image {
  src: string;
}

export interface Comment {
  User: User;
  content: string;
}

export interface Post {
  id: number;
  email?: string;
  User: User;
  content: string;
  createdAt: number;
  Images: Image[];
  Comments: Comment[];
}

export interface PostsState {
  mainPosts: Post[];
  imagePaths: string[];
  postAdded: boolean;
}
