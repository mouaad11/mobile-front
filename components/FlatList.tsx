import React from 'react';
import {
  StyleSheet,
  FlatList as RNFlatList,
  RefreshControl,
  ViewStyle,
  FlatListProps as RNFlatListProps,
  ListRenderItem,
} from 'react-native';
import Colors from '@/constant/Colors';
import Loading from './Loading';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

interface FlatListProps<T> extends Omit<RNFlatListProps<T>, 'renderItem'> {
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  emptyTitle?: string;
  renderItem: ListRenderItem<T>;
}

export default function FlatList<T>({
  style,
  contentContainerStyle,
  refreshing = false,
  onRefresh,
  loading = false,
  error,
  emptyMessage = 'No items found',
  emptyTitle = 'Nothing to show',
  data,
  renderItem,
  ...props
}: FlatListProps<T>) {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRefresh} />;
  }

  if (!data?.length) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
      />
    );
  }

  return (
    <RNFlatList
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
      data={data}
      renderItem={renderItem}
      {...props}
    />
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