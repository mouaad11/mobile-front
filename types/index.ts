export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Movie {
  id: string;
  title: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
}

export interface Watchlist {
  id: string;
  name: string;
  description: string;
  userId: string;
  movies: Movie[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface ApiResponse<T> {
  data: T;
  error?: ApiError;
} 