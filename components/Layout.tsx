import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constant/Colors';
import TabBar from './TabBar';

interface LayoutProps {
  children: React.ReactNode;
  style?: ViewStyle;
  showTabBar?: boolean;
}

export default function Layout({
  children,
  style,
  showTabBar = true,
}: LayoutProps) {
  return (
    <View style={[styles.container, style]}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: Colors.BACKGROUND,
          },
        }}
      />
      <View style={styles.content}>{children}</View>
      {showTabBar && <TabBar />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  content: {
    flex: 1,
  },
}); 