import { colors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
  backgroundColor?: string;
  fillColor?: string;
  style?: ViewStyle;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 8,
  backgroundColor = colors.border,
  fillColor = colors.primary,
  style,
  animated = true,
}) => {
  // Ensure progress is between 0 and 1
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  
  return (
    <View style={[styles.container, { height }, style]}>
      <View 
        style={[
          styles.fill, 
          { 
            width: `${clampedProgress * 100}%`,
            backgroundColor: fillColor,
          },
          animated && styles.animated
        ]} 
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor, zIndex: -1 }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  animated: {
    transition: 'width 0.3s ease-in-out',
  },
});