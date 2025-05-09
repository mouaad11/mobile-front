import React from 'react';
import { StyleSheet, Text as RNText, TextProps as RNTextProps, Platform } from 'react-native';
import Colors from '@/constant/Colors';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'button';
  color?: string;
}

export default function Text({
  variant = 'body',
  color,
  style,
  ...props
}: TextProps) {
  const getFontSize = () => {
    switch (variant) {
      case 'h1':
        return 32;
      case 'h2':
        return 24;
      case 'h3':
        return 20;
      case 'h4':
        return 18;
      case 'body':
        return 16;
      case 'caption':
        return 14;
      case 'button':
        return 16;
      default:
        return 16;
    }
  };

  const getFontWeight = () => {
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'button':
        return 'bold';
      default:
        return 'normal';
    }
  };

  const getColor = () => {
    if (color) return color;
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
        return Colors.TEXT_PRIMARY;
      case 'body':
        return Colors.TEXT_SECONDARY;
      case 'caption':
        return Colors.TEXT_MUTED;
      case 'button':
        return Colors.TEXT_PRIMARY;
      default:
        return Colors.TEXT_SECONDARY;
    }
  };

  return (
    <RNText
      style={[
        styles.text,
        {
          fontSize: getFontSize(),
          fontWeight: getFontWeight(),
          color: getColor(),
        },
        style,
      ]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Platform.select({
      ios: 'System',
      android: 'Roboto',
    }),
  },
}); 