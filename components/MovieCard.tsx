import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constant/Colors';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

interface MovieCardProps {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  releaseDate: string;
  voteAverage: number;
  genres: string[];
}

export default function MovieCard({
  id,
  title,
  overview,
  posterUrl,
  releaseDate,
  voteAverage,
  genres,
}: MovieCardProps) {
  const handlePress = () => {
    router.push(`/movie/${id}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image
        source={{ uri: posterUrl }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color={Colors.WARNING} />
            <Text style={styles.ratingText}>{voteAverage.toFixed(1)}</Text>
          </View>
        </View>
        
        <View style={styles.genres}>
          {genres.slice(0, 2).map((genre, index) => (
            <View key={index} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>
        
        <Text style={styles.overview} numberOfLines={2}>
          {overview}
        </Text>
        
        <View style={styles.footer}>
          <Text style={styles.year}>
            {new Date(releaseDate).getFullYear()}
          </Text>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsText}>View Details</Text>
            <Ionicons name="arrow-forward" size={16} color={Colors.ACCENT} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.5,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.CARD_BACKGROUND,
    marginHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: Colors.SHADOW_COLOR,
        shadowOffset: Colors.SHADOW_OFFSET,
        shadowOpacity: Colors.SHADOW_OPACITY,
        shadowRadius: Colors.SHADOW_RADIUS,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  poster: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.OVERLAY,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
    marginRight: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.CARD_BACKGROUND,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: Colors.TEXT_PRIMARY,
    marginLeft: 4,
    fontWeight: '600',
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  genreTag: {
    backgroundColor: Colors.ACCENT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  genreText: {
    color: Colors.WHITE,
    fontSize: 12,
    fontWeight: '600',
  },
  overview: {
    color: Colors.TEXT_SECONDARY,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  year: {
    color: Colors.TEXT_MUTED,
    fontSize: 14,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsText: {
    color: Colors.ACCENT,
    fontSize: 14,
    fontWeight: '600',
  },
}); 