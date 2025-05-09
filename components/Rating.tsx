import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constant/Colors';

interface RatingProps {
  value: number;
  size?: number;
  showValue?: boolean;
  style?: any;
}

export default function Rating({
  value,
  size = 16,
  showValue = true,
  style,
}: RatingProps) {
  const stars = [];
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 >= 0.5;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Ionicons
          key={i}
          name="star"
          size={size}
          color={Colors.WARNING}
          style={styles.star}
        />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <Ionicons
          key={i}
          name="star-half"
          size={size}
          color={Colors.WARNING}
          style={styles.star}
        />
      );
    } else {
      stars.push(
        <Ionicons
          key={i}
          name="star-outline"
          size={size}
          color={Colors.TEXT_MUTED}
          style={styles.star}
        />
      );
    }
  }

  return (
    <View style={[styles.container, style]}>
      {stars}
      {showValue && (
        <Text style={[styles.value, { fontSize: size }]}>
          {value.toFixed(1)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  value: {
    marginLeft: 4,
    color: Colors.TEXT_PRIMARY,
    fontWeight: '600',
  },
}); 