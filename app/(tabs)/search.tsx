import React from 'react';
import { StyleSheet, View } from 'react-native';
import SafeArea from '@/components/SafeArea';
import Colors from '@/constant/Colors';
import Text from '@/components/Text';

export default function SearchScreen() {
  return (
    <SafeArea edges={['top']}>
      <View style={styles.container}>
        <Text variant="h1">Search</Text>
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    padding: 16,
  },
}); 