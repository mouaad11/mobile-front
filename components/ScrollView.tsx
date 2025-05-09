import React from 'react';
import {
  StyleSheet,
  ScrollView as RNScrollView,
  RefreshControl,
  ViewStyle,
  ScrollViewProps as RNScrollViewProps,
} from 'react-native';
import Colors from '@/constant/Colors';

interface ScrollViewProps extends RNScrollViewProps {
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
  children: React.ReactNode;
}

export default function ScrollView({
  style,
  contentContainerStyle,
  refreshing = false,
  onRefresh,
  children,
  ...props
}: ScrollViewProps) {
  return (
    <RNScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.ACCENT}
            colors={[Colors.ACCENT]}
          />
        ) : undefined
      }
      {...props}
    >
      {children}
    </RNScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
}); 