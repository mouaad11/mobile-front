import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import SafeArea from '@/components/SafeArea';
import Colors from '@/constant/Colors';
import Text from '@/components/Text';
import { api, endpoints } from '@/api';
import MovieCard from '@/components/MovieCard';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
}

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await api.get(endpoints.movies.getAll);
      setMovies(response.data);
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeArea edges={['top']}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.ACCENT} />
        </View>
      </SafeArea>
    );
  }

  if (error) {
    return (
      <SafeArea edges={['top']}>
        <View style={styles.container}>
          <Text variant="h2" color={Colors.ERROR}>{error}</Text>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea edges={['top']}>
      <View style={styles.container}>
        <Text variant="h1" style={styles.title}>Popular Movies</Text>
        <FlatList
          data={movies}
          renderItem={({ item }) => (
            <MovieCard
              id={item.id}
              title={item.title}
              overview={item.overview}
              posterUrl={item.posterUrl}
              releaseDate={item.releaseDate}
              voteAverage={item.voteAverage}
              genres={item.genres}
            />
          )}
          keyExtractor={item => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  list: {
    paddingRight: 16,
  },
}); 