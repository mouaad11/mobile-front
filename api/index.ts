import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Platform } from 'react-native';

const BASE_URL = 'http://192.168.8.115:8082/api';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to headers
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
      router.replace('/login');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  users: {
    getById: (id: string) => `/users/${id}`,
    create: '/users',
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    login: '/users/login',
  },

  movies: {
    getAll: '/movies',
    getById: (id: string) => `/movies/${id}`,
    create: '/movies',
    update: (id: string) => `/movies/${id}`,
    delete: (id: string) => `/movies/${id}`,
    search: '/movies/search',
  },

  watchlists: {
    getAll: '/watchlists',
    getByUser: (userId: string) => `/watchlists/user/${userId}`,
    getById: (id: string) => `/watchlists/${id}`,
    create: (userId: string) => `/watchlists/user/${userId}`,
    update: (id: string) => `/watchlists/${id}`,
    delete: (id: string) => `/watchlists/${id}`,

    items: {
      getAll: (watchlistId: string) => `/watchlists/${watchlistId}/items`,
      getByStatus: (watchlistId: string, status: string) =>
        `/watchlists/${watchlistId}/items/status/${status}`,
      add: (watchlistId: string) => `/watchlists/${watchlistId}/items`,
      update: (itemId: string) => `/watchlists/items/${itemId}`,
      delete: (itemId: string) => `/watchlists/items/${itemId}`,
    },
  },
};
