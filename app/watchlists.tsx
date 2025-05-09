import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  SafeAreaView,
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constant/Colors';
import { api, endpoints } from '@/api';

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
 * Watchlists Screen Component
 * 
 * This component displays a list of user's watchlists fetched from the backend.
 */
export default function Watchlists() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const fetchWatchlists = async () => {
    if (!global.userId) {
      Alert.alert(
        'Login Required',
        'Please login to view your watchlists',
        [{ text: 'Login', onPress: () => router.push('/login') }]
      );
      return;
    }

    try {
      const response = await api.get(endpoints.watchlists.getByUser(global.userId));
      setWatchlists(response.data);
    } catch (error) {
      console.error('Error fetching watchlists:', error);
      Alert.alert('Error', 'Failed to load watchlists');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateWatchlist = async () => {
    if (!global.userId) {
      Alert.alert(
        'Login Required',
        'Please login to create watchlists',
        [{ text: 'Login', onPress: () => router.push('/login') }]
      );
      return;
    }

    try {
      await api.post(endpoints.watchlists.create(global.userId), {
        name: 'New Watchlist',
        description: 'Created from mobile app'
      });
      fetchWatchlists();
    } catch (error) {
      console.error('Error creating watchlist:', error);
      Alert.alert('Error', 'Failed to create watchlist');
    }
  };

  const handleDeleteWatchlist = async (watchlistId: string) => {
    Alert.alert(
      'Delete Watchlist',
      'Are you sure you want to delete this watchlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(endpoints.watchlists.delete(watchlistId));
              fetchWatchlists();
            } catch (error) {
              console.error('Error deleting watchlist:', error);
              Alert.alert('Error', 'Failed to delete watchlist');
            }
          },
        },
      ]
    );
  };

  const renderWatchlistItem = ({ item }: { item: Watchlist }) => (
    <TouchableOpacity
      style={styles.watchlistCard}
      onPress={() => router.push(`/watchlist/${item.id}`)}
    >
      <View style={styles.watchlistHeader}>
        <Text style={styles.watchlistName}>{item.name}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteWatchlist(item.id.toString())}
        >
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      {item.description && (
        <Text style={styles.watchlistDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      <Text style={styles.movieCount}>
        {item.movieCount} {item.movieCount === 1 ? 'movie' : 'movies'}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.ACCENT} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Watchlists</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateWatchlist}
        >
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={watchlists}
        renderItem={renderWatchlistItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchWatchlists();
            }}
            colors={[Colors.ACCENT]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No watchlists yet</Text>
            <TouchableOpacity
              style={styles.createFirstButton}
              onPress={handleCreateWatchlist}
            >
              <Text style={styles.createFirstButtonText}>Create Your First Watchlist</Text>
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
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.PRIMARY,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.WHITE,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 24,
    color: Colors.WHITE,
    fontWeight: 'bold',
  },
  list: {
    padding: 16,
  },
  watchlistCard: {
    backgroundColor: Colors.CARD_BACKGROUND,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  watchlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  watchlistName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.TEXT_PRIMARY,
    flex: 1,
  },
  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.ERROR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: Colors.WHITE,
    fontSize: 20,
    fontWeight: 'bold',
  },
  watchlistDescription: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 8,
  },
  movieCount: {
    fontSize: 14,
    color: Colors.TEXT_MUTED,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.TEXT_MUTED,
    marginBottom: 16,
  },
  createFirstButton: {
    backgroundColor: Colors.ACCENT,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createFirstButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: '600',
  },
});
