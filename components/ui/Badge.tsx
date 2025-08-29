import { colors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'medium',
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.badge, styles[variant], styles[size], style]}>
      <Text style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`], textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
  },
  default: {
    backgroundColor: colors.primary,
  },
  defaultText: {
    color: colors.card,
  },
  success: {
    backgroundColor: colors.success,
  },
  successText: {
    color: colors.card,
  },
  warning: {
    backgroundColor: colors.warning,
  },
  warningText: {
    color: colors.textDark,
  },
  error: {
    backgroundColor: colors.error,
  },
  errorText: {
    color: colors.card,
  },
  info: {
    backgroundColor: colors.info,
  },
  infoText: {
    color: colors.card,
  },
  small: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  smallText: {
    fontSize: 10,
  },
  medium: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  mediumText: {
    fontSize: 12,
  },
  large: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  largeText: {
    fontSize: 14,
  },
});