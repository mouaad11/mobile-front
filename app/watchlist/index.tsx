import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constant/Colors';
import { commonStyles } from '@/constant/Styles';
import { api, endpoints } from '@/api';
import type { Watchlist } from '@/types';

export default function Watchlists() {
  const [watchlists, setWatchlists] = useState<Watchlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState('');
  const [newWatchlistDescription, setNewWatchlistDescription] = useState('');
  const [creating, setCreating] = useState(false);

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
    if (!newWatchlistName.trim()) {
      Alert.alert('Error', 'Please enter a watchlist name');
      return;
    }

    setCreating(true);
    try {
      await api.post(endpoints.watchlists.create(global.userId), {
        name: newWatchlistName,
        description: newWatchlistDescription
      });
      setNewWatchlistName('');
      setNewWatchlistDescription('');
      setShowCreateModal(false);
      fetchWatchlists();
    } catch (error) {
      console.error('Error creating watchlist:', error);
      Alert.alert('Error', 'Failed to create watchlist');
    } finally {
      setCreating(false);
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
          onPress={() => handleDeleteWatchlist(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color={Colors.ERROR} />
        </TouchableOpacity>
      </View>
      {item.description && (
        <Text style={styles.watchlistDescription} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      <View style={styles.watchlistFooter}>
        <Text style={styles.movieCount}>
          {item.movieCount} {item.movieCount === 1 ? 'movie' : 'movies'}
        </Text>
        <Ionicons name="chevron-forward" size={20} color={Colors.TEXT_MUTED} />
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={commonStyles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.ACCENT} />
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={commonStyles.title}>My Watchlists</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Ionicons name="add" size={24} color={Colors.WHITE} />
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
            <Ionicons name="list-outline" size={64} color={Colors.TEXT_MUTED} />
            <Text style={styles.emptyText}>No watchlists yet</Text>
            <TouchableOpacity
              style={[commonStyles.button, styles.createFirstButton]}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={commonStyles.buttonText}>Create Your First Watchlist</Text>
            </TouchableOpacity>
          </View>
        }
      />

      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={commonStyles.title}>Create Watchlist</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color={Colors.TEXT_PRIMARY} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={commonStyles.input}
              placeholder="Watchlist name"
              placeholderTextColor={Colors.TEXT_MUTED}
              value={newWatchlistName}
              onChangeText={setNewWatchlistName}
            />

            <TextInput
              style={[commonStyles.input, styles.descriptionInput]}
              placeholder="Description (optional)"
              placeholderTextColor={Colors.TEXT_MUTED}
              value={newWatchlistDescription}
              onChangeText={setNewWatchlistDescription}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity
              style={[commonStyles.button, creating && styles.buttonDisabled]}
              onPress={handleCreateWatchlist}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator color={Colors.WHITE} />
              ) : (
                <Text style={commonStyles.buttonText}>Create Watchlist</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.PRIMARY,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.ACCENT,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 4,
  },
  watchlistDescription: {
    fontSize: 14,
    color: Colors.TEXT_SECONDARY,
    marginBottom: 12,
  },
  watchlistFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  movieCount: {
    fontSize: 14,
    color: Colors.TEXT_MUTED,
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
    marginBottom: 24,
  },
  createFirstButton: {
    width: '100%',
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
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
}); 