import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Colors from '@/constant/Colors';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightComponent?: React.ReactNode;
  transparent?: boolean;
}

export default function Header({
  title,
  showBack = true,
  rightComponent,
  transparent = false,
}: HeaderProps) {
  const handleBack = () => {
    router.back();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: transparent
            ? Colors.TRANSPARENT
            : Colors.CARD_BACKGROUND,
        },
      ]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={transparent ? Colors.TRANSPARENT : Colors.CARD_BACKGROUND}
        translucent
      />
      <View style={styles.content}>
        {showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color={Colors.TEXT_PRIMARY} />
          </TouchableOpacity>
        )}
        <Text
          style={[
            styles.title,
            { marginLeft: showBack ? 0 : 16 },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {rightComponent && (
          <View style={styles.rightComponent}>{rightComponent}</View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight,
    ...Platform.select({
      ios: {
        shadowColor: Colors.SHADOW_COLOR,
        shadowOffset: Colors.SHADOW_OFFSET,
        shadowOpacity: Colors.SHADOW_OPACITY,
        shadowRadius: Colors.SHADOW_RADIUS,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.TEXT_PRIMARY,
  },
  rightComponent: {
    marginLeft: 16,
  },
}); 