// types/index.ts

export interface User {
  id?: number;
  nickname: string;
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
  User: User;
  content: string;
  Images: Image[];
  Comments: Comment[];
}

export interface PostsState {
  mainPosts: Post[];
  imagePaths: string[];
  postAdded: boolean;
}
