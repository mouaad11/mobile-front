import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  SafeAreaView
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Colors from '@/constant/Colors';
import { api, endpoints } from '@/api';

/**
 * WatchlistItem interface defining the structure of a watchlist item
 */
interface WatchlistItem {
  id: number;
  movie: {
    id: number;
    title: string;
    overview: string;
    posterUrl: string;
    releaseDate: string;
    genres: string[];
  };
  status: string;
  addedAt: string;
}

/**
 * Watchlist interface defining the structure of a watchlist
 */
interface Watchlist {
  id: number;
  name: string;
  description: string;
  items: WatchlistItem[];
}

/**
 * Watchlist Details Screen Component
 * 
 * This component displays the details of a watchlist and its movies.
 */
export default function WatchlistDetails() {
  const { id } = useLocalSearchParams();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch watchlist details from the backend
   */
  const fetchWatchlistItems = async () => {
    try {
      const response = await api.get(endpoints.watchlists.items.getAll(id as string));
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching watchlist items:', error);
      Alert.alert('Error', 'Failed to load watchlist items');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle pull-to-refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
    fetchWatchlistItems();
  };

  // Fetch watchlist details on component mount
  useEffect(() => {
    fetchWatchlistItems();
  }, [id]);

  /**
   * Render a watchlist item in the list
   */
  const renderWatchlistItem = ({ item }: { item: WatchlistItem }) => (
    <View style={styles.movieCard}>
      <TouchableOpacity 
        style={styles.movieCardContent} 
        onPress={() => router.push(`/movie/${item.movie.id}`)}
      >
        <Image 
          source={{ 
            uri: item.movie.posterUrl 
              ? item.movie.posterUrl 
              : 'https://via.placeholder.com/150x225?text=No+Image' 
          }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.movieInfo}>
          <Text style={styles.movieTitle} numberOfLines={2}>{item.movie.title}</Text>
          <Text style={styles.releaseDate}>
            {item.movie.releaseDate ? new Date(item.movie.releaseDate).getFullYear() : 'Date inconnue'}
          </Text>
          <View style={styles.genresContainer}>
            {item.movie.genres && item.movie.genres.slice(0, 2).map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.status}>{item.status.replace('_', ' ')}</Text>
        </View>
      </TouchableOpacity>

      {/* Remove button */}
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => {
          Alert.alert(
            'Confirmation',
            'Voulez-vous vraiment retirer ce film de la liste ?',
            [
              { text: 'Annuler', style: 'cancel' },
              { text: 'Retirer', style: 'destructive', onPress: () => handleRemoveItem(item.id) }
            ]
          );
        }}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  const handleRemoveItem = async (itemId: number) => {
    Alert.alert(
      'Remove Movie',
      'Are you sure you want to remove this movie from your watchlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(endpoints.watchlists.items.delete(itemId.toString()));
              fetchWatchlistItems();
            } catch (error) {
              console.error('Error removing movie:', error);
              Alert.alert('Error', 'Failed to remove movie from watchlist');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.PRIMARY} />
        <Text style={styles.loadingText}>Chargement de la liste...</Text>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Cette liste ne contient aucun film.
        </Text>
        <TouchableOpacity 
          style={styles.browseButton}
          onPress={() => router.push('/home')}
        >
          <Text style={styles.browseButtonText}>Parcourir les films</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{items[0].movie.title}</Text>
        <View style={{ width: 50 }} />
      </View>

      {items[0].movie.overview && (
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{items[0].movie.overview}</Text>
        </View>
      )}

      <FlatList
        data={items}
        renderItem={renderWatchlistItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.movieList}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              Cette liste ne contient aucun film.
            </Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/home')}
            >
              <Text style={styles.browseButtonText}>Parcourir les films</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  descriptionContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#666',
    fontStyle: 'italic',
  },
  movieList: {
    padding: 16,
  },
  movieCard: {
    position: 'relative',
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  movieCardContent: {
    flexDirection: 'row',
  },
  poster: {
    width: 100,
    height: 150,
  },
  movieInfo: {
    flex: 1,
    padding: 12,
  },
  movieTitle: {
    fontSize: 16,
    fontFamily: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  releaseDate: {
    fontSize: 14,
    fontFamily: 'regular',
    color: '#666',
    marginBottom: 6,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  genreTag: {
    backgroundColor: Colors.PRIMARY + '20', // 20% opacity
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 6,
  },
  genreText: {
    fontSize: 12,
    fontFamily: 'regular',
    color: Colors.PRIMARY,
  },
  status: {
    fontSize: 14,
    fontFamily: 'bold',
    color: Colors.PRIMARY,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
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
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  browseButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: 'bold',
  },
});