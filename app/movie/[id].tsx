import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constant/Colors';
import { commonStyles } from '@/constant/Styles';
import { api, endpoints } from '@/api';
import type { Movie } from '@/types';

const { width } = Dimensions.get('window');

/**
 * Movie interface defining the structure of a movie object
 */
interface Watchlist {
  id: number;
  name: string;
  description: string;
}

/**
 * Movie Details Screen Component
 * 
 * This component displays detailed information about a selected movie
 * and allows users to add it to their watchlists.
 */
export default function MovieDetails() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [showWatchlistModal, setShowWatchlistModal] = useState(false);
  const [addingToWatchlist, setAddingToWatchlist] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await api.get(endpoints.movies.getById(id as string));
      setMovie(response.data);
      if (global.userId) {
        checkWatchlistStatus(response.data.id);
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      Alert.alert('Error', 'Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const checkWatchlistStatus = async (movieId: number) => {
    try {
      const response = await api.get(endpoints.watchlists.items.getByStatus(global.userId, 'active'));
      const isInList = response.data.some((item: any) => item.movie.id === movieId);
      setIsInWatchlist(isInList);
    } catch (error) {
      console.error('Error checking watchlist status:', error);
    }
  };

  const handleShare = async () => {
    if (!movie) return;

    try {
      await Share.share({
        message: `Check out ${movie.title} on our movie app!`,
        title: movie.title,
      });
    } catch (error) {
      console.error('Error sharing movie:', error);
    }
  };

  const handleAddToWatchlist = () => {
    if (!global.userId) {
      Alert.alert(
        'Login Required',
        'Please login to add movies to your watchlist',
        [{ text: 'Login', onPress: () => router.push('/login') }]
      );
      return;
    }

    router.push({
      pathname: '/watchlist/add',
      params: { movieId: movie?.id },
    });
  };

  if (loading) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.ACCENT} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={commonStyles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={Colors.ERROR} />
        <Text style={styles.errorText}>Movie not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={commonStyles.container} bounces={false}>
      <View style={styles.header}>
        <Image
          source={{ uri: movie.posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.WHITE} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={Colors.WHITE} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.year}>
          {new Date(movie.releaseDate).getFullYear()}
        </Text>

        <View style={styles.genreContainer}>
          {movie.genres.map((genre, index) => (
            <View key={index} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>

        <TouchableOpacity
          style={[
            styles.watchlistButton,
            isInWatchlist && styles.watchlistButtonActive,
          ]}
          onPress={handleAddToWatchlist}
        >
          <Ionicons
            name={isInWatchlist ? 'checkmark-circle' : 'add-circle-outline'}
            size={24}
            color={Colors.WHITE}
          />
          <Text style={styles.watchlistButtonText}>
            {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: width * 1.5,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    backgroundColor: Colors.BACKGROUND,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 8,
  },
  year: {
    fontSize: 18,
    color: Colors.TEXT_MUTED,
    marginBottom: 16,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  genreTag: {
    backgroundColor: Colors.ACCENT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: Colors.WHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    marginBottom: 12,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 24,
  },
  watchlistButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.ACCENT,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  watchlistButtonActive: {
    backgroundColor: Colors.SUCCESS,
  },
  watchlistButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: Colors.ERROR,
    fontSize: 18,
    marginTop: 16,
  },
});
