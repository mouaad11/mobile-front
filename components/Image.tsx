import React, { useState } from 'react';
import {
  StyleSheet,
  Image as RNImage,
  ImageProps as RNImageProps,
  View,
  ActivityIndicator,
} from 'react-native';
import Colors from '@/constant/Colors';

interface ImageProps extends Omit<RNImageProps, 'source'> {
  source: string;
  fallback?: string;
}

export default function Image({ source, fallback, style, ...props }: ImageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoadStart = () => {
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  return (
    <View style={[styles.container, style]}>
      <RNImage
        source={{ uri: error ? fallback : source }}
        style={[styles.image, style]}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
        {...props}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={Colors.ACCENT} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.CARD_BACKGROUND,
  },
}); 