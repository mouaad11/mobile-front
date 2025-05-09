import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  SafeAreaView,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constant/Colors';
import { api, endpoints } from '@/api';

/**
 * Genre interface defining the structure of a genre object
 */
interface Genre {
  id: string;
  name: string;
  movieCount: number;
}

/**
 * Genres Screen Component
 * 
 * This component displays a list of movie genres that users can browse.
 */
export default function Genres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch genres from the backend
   */
  const fetchGenres = async () => {
    try {
      const response = await api.get(endpoints.movies.search);
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
      Alert.alert('Error', 'Failed to load genres');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Navigate to genre movies screen
   * @param genreName The name of the genre to view
   */
  const handleGenrePress = (genreName: string) => {
    router.push(`/genre/${encodeURIComponent(genreName)}`);
  };

  // Fetch genres on component mount
  useEffect(() => {
    fetchGenres();
  }, []);

  /**
   * Render a genre item in the list
   */
  const renderGenreItem = ({ item }: { item: Genre }) => (
    <TouchableOpacity 
      style={styles.genreCard} 
      onPress={() => handleGenrePress(item.name)}
    >
      <View style={styles.genreInfo}>
        <Text style={styles.genreName}>{item.name}</Text>
        <Text style={styles.movieCount}>{item.movieCount} films</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Genres</Text>
        <View style={{ width: 50 }} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
          <Text style={styles.loadingText}>Chargement des genres...</Text>
        </View>
      ) : (
        <FlatList
          data={genres}
          renderItem={renderGenreItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.genreList}
          numColumns={2}
          columnWrapperStyle={styles.genreRow}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                Aucun genre disponible.
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
    fontSize: 24,
    fontFamily: 'bold',
    color: Colors.WHITE,
  },
  backButton: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: 'regular',
  },
  genreList: {
    padding: 16,
  },
  genreRow: {
    justifyContent: 'space-between',
  },
  genreCard: {
    backgroundColor: Colors.WHITE,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    width: '48%',
  },
  genreInfo: {
    padding: 16,
    alignItems: 'center',
  },
  genreName: {
    fontSize: 18,
    fontFamily: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  movieCount: {
    fontSize: 14,
    fontFamily: 'regular',
    color: Colors.PRIMARY,
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