import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle } from 'react-native';
import Colors from '@/constant/Colors';

interface GenreTagProps {
  name: string;
  onPress?: () => void;
  style?: ViewStyle;
  selected?: boolean;
}

export default function GenreTag({
  name,
  onPress,
  style,
  selected = false,
}: GenreTagProps) {
  const TagComponent = onPress ? TouchableOpacity : Text;

  return (
    <TagComponent
      style={[
        styles.container,
        {
          backgroundColor: selected ? Colors.ACCENT : Colors.CARD_BACKGROUND,
        },
        style,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.text,
          {
            color: selected ? Colors.WHITE : Colors.TEXT_PRIMARY,
          },
        ]}
      >
        {name}
      </Text>
    </TagComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.BORDER,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 