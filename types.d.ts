// Declaration file for custom types in the app

// Extend the TextStyle interface to include our custom font families
import { TextStyle } from 'react-native';

declare module 'react-native' {
  interface TextStyle {
    fontFamily?: 'black' | 'regular' | 'bold' | string;
  }
}

// Declare global variables used in the app
declare global {
  var userId: string | null;
  var token: string | null;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  releaseDate: string;
  genres: string[];
}

export interface Watchlist {
  id: number;
  name: string;
  description: string;
  movieCount: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}