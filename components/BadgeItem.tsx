import { colors } from '@/constants/colors';
import { Badge as BadgeType } from '@/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from './ui/Card';

interface BadgeItemProps {
  badge: BadgeType;
  size?: 'small' | 'medium' | 'large';
}

export const BadgeItem: React.FC<BadgeItemProps> = ({
  badge,
  size = 'medium',
}) => {
  const iconSize = size === 'small' ? 32 : size === 'medium' ? 48 : 64;
  const fontSize = size === 'small' ? 12 : size === 'medium' ? 14 : 16;
  
  return (
    <Card 
      style={[
        styles.container, 
        !badge.unlocked && styles.locked,
        size === 'small' && styles.smallContainer,
        size === 'large' && styles.largeContainer,
      ]}
    >
      <View style={[
        styles.iconContainer,
        !badge.unlocked && styles.lockedIconContainer,
        { width: iconSize, height: iconSize }
      ]}>
        <Text style={[styles.icon, { fontSize: iconSize * 0.6 }]}>
          {badge.icon}
        </Text>
      </View>
      <Text style={[styles.name, { fontSize }]}>{badge.name}</Text>
      {size !== 'small' && (
        <Text style={[styles.description, { fontSize: fontSize - 2 }]}>
          {badge.description}
        </Text>
      )}
      {badge.unlocked && badge.unlockedAt && size === 'large' && (
        <Text style={styles.date}>
          Unlocked on {new Date(badge.unlockedAt).toLocaleDateString()}
        </Text>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 12,
  },
  smallContainer: {
    padding: 8,
    width: 100,
  },
  largeContainer: {
    padding: 16,
  },
  locked: {
    opacity: 0.5,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 100,
    marginBottom: 8,
  },
  lockedIconContainer: {
    backgroundColor: colors.border,
  },
  icon: {
    textAlign: 'center',
  },
  name: {
    fontWeight: '600',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    color: colors.textLight,
    textAlign: 'center',
  },
  date: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 8,
  },
});