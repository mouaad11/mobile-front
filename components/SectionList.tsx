import React from 'react';
import {
  StyleSheet,
  SectionList as RNSectionList,
  RefreshControl,
  ViewStyle,
  SectionListProps as RNSectionListProps,
  ListRenderItem,
  SectionListRenderItemInfo,
} from 'react-native';
import Colors from '@/constant/Colors';
import Loading from './Loading';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';

interface SectionListProps<T, S> extends Omit<RNSectionListProps<T, S>, 'renderItem'> {
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
  loading?: boolean;
  error?: string;
  emptyMessage?: string;
  emptyTitle?: string;
  renderItem: (info: SectionListRenderItemInfo<T, S>) => React.ReactElement | null;
}

export default function SectionList<T, S>({
  style,
  contentContainerStyle,
  refreshing = false,
  onRefresh,
  loading = false,
  error,
  emptyMessage = 'No items found',
  emptyTitle = 'Nothing to show',
  sections,
  renderItem,
  ...props
}: SectionListProps<T, S>) {
  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRefresh} />;
  }

  if (!sections?.length) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
      />
    );
  }

  return (
    <RNSectionList
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
      sections={sections}
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