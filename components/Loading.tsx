import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import Colors from '@/constant/Colors';

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
}

export default function Loading({ message, fullScreen = false }: LoadingProps) {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={Colors.ACCENT} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.MODAL_BACKGROUND,
    zIndex: 999,
  },
  message: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.TEXT_PRIMARY,
    textAlign: 'center',
  },
}); 