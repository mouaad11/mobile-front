import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '@/constant/Colors';
import { api, endpoints } from '@/api';

/**
 * Movie interface defining the structure of a movie object
 */
interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  releaseDate: string;
  genres: string[];
}

/**
 * Genre Movies Screen Component
 * 
 * This component displays a list of movies for a specific genre.
 */
export default function GenreMovies() {
  const { name } = useLocalSearchParams();
  const genreName = decodeURIComponent(String(name));

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch movies by genre from the backend
   */
  const fetchGenreMovies = async () => {
    try {
      const response = await api.get(endpoints.movies.search, {
        params: { genre: name }
      });
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching genre movies:', error);
      Alert.alert('Error', 'Failed to load movies for this genre');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
    fetchGenreMovies();
  };

  /**
   * Navigate to movie details screen
   * @param movieId The ID of the movie to view
   */
  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  // Fetch movies by genre on component mount
  useEffect(() => {
    fetchGenreMovies();
  }, [name]);

  /**
   * Render a movie item in the grid
   */
  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View style={styles.movieCard}>
      <TouchableOpacity 
        style={styles.movieCardContent} 
        onPress={() => handleMoviePress(item.id)}
      >
        <Image 
          source={{ 
            uri: item.posterUrl 
              ? item.posterUrl 
              : 'https://via.placeholder.com/150x225?text=No+Image' 
          }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.releaseDate}>
            {item.releaseDate ? new Date(item.releaseDate).getFullYear() : 'Date inconnue'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{genreName}</Text>
        <View style={{ width: 50 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Chargement des films...</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.movieList}
          numColumns={2}
          columnWrapperStyle={styles.movieRow}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Aucun film trouvé pour ce genre.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
    backgroundColor: Colors.PRIMARY,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'bold',
    color: Colors.WHITE,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: 'regular',
  },
  movieList: {
    padding: 12,
  },
  movieRow: {
    justifyContent: 'space-between',
  },
  movieCard: {
    position: 'relative',
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    overflow: 'hidden',
    width: '48%',
  },
  movieCardContent: {
    flexDirection: 'column',
  },
  poster: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  movieInfo: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 16,
    fontFamily: 'bold',
    marginBottom: 4,
    color: '#333',
    height: 40,
  },
  releaseDate: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'regular',
    color: '#666',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'regular',
    color: '#666',
    textAlign: 'center',
  },
});