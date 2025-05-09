import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  TextInput,
  SafeAreaView,
  Modal,
  Alert,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constant/Colors';
import { commonStyles } from '@/constant/Styles';
import { api, endpoints } from '@/api';

const { width } = Dimensions.get('window');

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
 * Watchlist interface defining the structure of a watchlist object
 */
interface Watchlist {
  id: number;
  name: string;
  description: string;
  movieCount: number;
}

/**
 * Home Screen Component
 * 
 * This component displays a list of movies fetched from the backend.
 * It includes search functionality, pagination, and the ability to add movies to watchlists.
 */
export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searching, setSearching] = useState(false);

  // Watchlist related state
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [watchlistModalVisible, setWatchlistModalVisible] = useState(false);
  const [loadingWatchlists, setLoadingWatchlists] = useState(false);

  /**
   * Fetch movies from the backend
   * @param pageNumber The page number to fetch
   * @param refresh Whether to refresh the list or append to it
   */
  const fetchMovies = async (pageNumber: number, refresh: boolean = false) => {
    if (refresh) {
      setLoading(true);
    }

    try {
      const response = await api.get(`/movies/page?page=${pageNumber}&size=20&sort=releaseDate&direction=desc`);
      setMovies(response.data.content);
      setHasMore(!response.data.last);
      setPage(response.data.number);
    } catch (error) {
      console.error('Error fetching movies:', error);
      Alert.alert('Error', 'Failed to load movies');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Search for movies by title
   */
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchMovies(0, true);
      return;
    }

    setSearching(true);
    setLoading(true);

    try {
      const response = await api.get(`/movies/search?query=${encodeURIComponent(searchQuery)}`);
      setMovies(response.data);
      setHasMore(false);
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Error', 'Failed to search movies');
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
    setSearchQuery('');
    fetchMovies(0, true);
  };

  /**
   * Load more movies when reaching the end of the list
   */
  const loadMoreMovies = () => {
    if (!loading && hasMore && !searching) {
      fetchMovies(page + 1);
    }
  };

  /**
   * Navigate to movie details screen
   * @param movieId The ID of the movie to view
   */
  const viewMovieDetails = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  /**
   * Fetch user's watchlists from the backend
   */
  const fetchUserWatchlists = async () => {
    if (!global.userId) {
      Alert.alert('Login Required', 'Please login to view your watchlists');
      return;
    }
    try {
      const response = await api.get(endpoints.watchlists.getByUser(global.userId));
      setWatchlists(response.data);
    } catch (error) {
      console.error('Error fetching watchlists:', error);
    }
  };

  /**
   * Open the watchlist selection modal for a movie
   * @param movie The movie to add to a watchlist
   */
  const openWatchlistModal = (movie: Movie) => {
    if (!global.userId) {
      // If user is not logged in, show alert and redirect to login
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour ajouter des films à vos listes.',
        [{ text: 'Se connecter', onPress: () => router.push('/login') }]
      );
      return;
    }

    setSelectedMovie(movie);
    fetchUserWatchlists(); // Fetch the latest watchlists
    setWatchlistModalVisible(true);
  };

  /**
   * Add a movie to a watchlist
   * @param watchlistId The ID of the watchlist to add the movie to
   */
  const addToWatchlist = async (watchlistId: string) => {
    if (!selectedMovie) {
      Alert.alert('Erreur', 'Aucun film sélectionné');
      return;
    }

    if (!global.userId) {
      // If user is not logged in, show alert and redirect to login
      Alert.alert(
        'Connexion requise',
        'Vous devez être connecté pour ajouter des films à vos listes.',
        [{ text: 'Se connecter', onPress: () => {
          setWatchlistModalVisible(false);
          router.push('/login');
        }}]
      );
      return;
    }

    try {
      await api.post(endpoints.watchlists.items.add(watchlistId), {
        movieId: selectedMovie.id
      });
      Alert.alert(
        'Succès',
        `"${selectedMovie.title}" a été ajouté à votre liste de films.`
      );

      // Close the modal
      setWatchlistModalVisible(false);
      setSelectedMovie(null);
    } catch (error) {
      console.error('Error adding movie to watchlist:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter le film à votre liste');
    }
  };

  /**
   * Create a new watchlist and add the selected movie to it
   */
  const createWatchlistAndAddMovie = () => {
    // For simplicity, we'll just show an alert
    // In a real app, this would open a form to create a new watchlist
    Alert.alert(
      'Créer une nouvelle liste',
      'Cette fonctionnalité sera disponible prochainement.',
      [
        { text: 'OK', onPress: () => setWatchlistModalVisible(false) }
      ]
    );
  };

  // Fetch movies on component mount
  useEffect(() => {
    fetchMovies(0, true);
  }, []);

  /**
   * Render a movie item in the grid
   */
  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
      style={styles.movieCard}
      onPress={() => viewMovieDetails(item.id)}
    >
      <Image 
        source={{ uri: item.posterUrl }} 
        style={styles.moviePoster}
      />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.movieYear}>
          {new Date(item.releaseDate).getFullYear()}
        </Text>
        <View style={styles.genreContainer}>
          {item.genres.slice(0, 2).map((genre, index) => (
            <View key={index} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => openWatchlistModal(item)}
      >
        <Ionicons name="add-circle" size={24} color={Colors.ACCENT} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderGenre = ({ item }: { item: string }) => (
    <View style={styles.genreTag}>
      <Text style={styles.genreText}>{item}</Text>
    </View>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>Discover Movies</Text>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.TEXT_MUTED} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            placeholderTextColor={Colors.TEXT_MUTED}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => {
              setSearchQuery('');
              fetchMovies(0, true);
            }}>
              <Ionicons name="close-circle" size={20} color={Colors.TEXT_MUTED} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={commonStyles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.ACCENT} />
        </View>
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal={false}
          numColumns={2}
          contentContainerStyle={styles.movieList}
          onEndReached={loadMoreMovies}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[Colors.ACCENT]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="film-outline" size={64} color={Colors.TEXT_MUTED} />
              <Text style={styles.emptyText}>No movies found</Text>
            </View>
          }
        />
      )}

      <Modal
        visible={watchlistModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setWatchlistModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={commonStyles.title}>Add to Watchlist</Text>
              <TouchableOpacity onPress={() => setWatchlistModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            {loadingWatchlists ? (
              <ActivityIndicator size="large" color={Colors.ACCENT} />
            ) : (
              <>
                <FlatList
                  data={watchlists}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.watchlistItem}
                      onPress={() => addToWatchlist(item.id.toString())}
                    >
                      <Text style={styles.watchlistName}>{item.name}</Text>
                      <Text style={styles.watchlistCount}>
                        {item.movieCount} movies
                      </Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={[commonStyles.button, styles.createButton]}
                  onPress={createWatchlistAndAddMovie}
                >
                  <Text style={commonStyles.buttonText}>Create New Watchlist</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: Colors.PRIMARY,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: Colors.TEXT_PRIMARY,
    marginLeft: 8,
  },
  movieList: {
    padding: 8,
  },
  movieCard: {
    flex: 1,
    margin: 8,
    borderRadius: 12,
    backgroundColor: Colors.CARD_BACKGROUND,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  moviePoster: {
    width: '100%',
    height: width * 0.7,
    resizeMode: 'cover',
  },
  movieInfo: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 4,
  },
  movieYear: {
    fontSize: 14,
    color: Colors.TEXT_MUTED,
    marginBottom: 8,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  genreTag: {
    backgroundColor: Colors.ACCENT,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  genreText: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    color: Colors.TEXT_MUTED,
    fontSize: 16,
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.PRIMARY,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  watchlistItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.TEXT_MUTED,
  },
  watchlistName: {
    color: Colors.TEXT_PRIMARY,
    fontSize: 16,
    fontWeight: '500',
  },
  watchlistCount: {
    color: Colors.TEXT_MUTED,
    fontSize: 14,
    marginTop: 4,
  },
  createButton: {
    marginTop: 16,
  },
});
