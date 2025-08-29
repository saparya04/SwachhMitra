import { colors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface WasteChartProps {
  data: {
    wet: number;
    dry: number;
    hazardous: number;
  };
  size?: number;
  showLabels?: boolean;
  showPercentages?: boolean;
}

export const WasteChart: React.FC<WasteChartProps> = ({
  data,
  size = 200,
  showLabels = true,
  showPercentages = true,
}) => {
  const total = data.wet + data.dry + data.hazardous;
  
  // Calculate angles for the pie chart segments
  const wetAngle = (data.wet / total) * 360;
  const dryAngle = (data.dry / total) * 360;
  const hazardousAngle = (data.hazardous / total) * 360;
  
  // Calculate percentages
  const wetPercentage = Math.round((data.wet / total) * 100);
  const dryPercentage = Math.round((data.dry / total) * 100);
  const hazardousPercentage = Math.round((data.hazardous / total) * 100);
  
  return (
    <View style={styles.container}>
      <View style={[styles.chart, { width: size, height: size }]}>
        {/* Wet waste segment */}
        <View
          style={[
            styles.segment,
            {
              backgroundColor: '#4CAF50', // Green
              transform: [
                { rotate: '0deg' },
                { translateX: size / 2 },
                { translateY: size / 2 },
                { rotate: `${wetAngle}deg` },
                { translateX: -size / 2 },
                { translateY: -size / 2 },
              ],
              zIndex: 3,
            },
          ]}
        />
        
        {/* Dry waste segment */}
        <View
          style={[
            styles.segment,
            {
              backgroundColor: '#2196F3', // Blue
              transform: [
                { rotate: `${wetAngle}deg` },
                { translateX: size / 2 },
                { translateY: size / 2 },
                { rotate: `${dryAngle}deg` },
                { translateX: -size / 2 },
                { translateY: -size / 2 },
              ],
              zIndex: 2,
            },
          ]}
        />
        
        {/* Hazardous waste segment */}
        <View
          style={[
            styles.segment,
            {
              backgroundColor: '#F44336', // Red
              transform: [
                { rotate: `${wetAngle + dryAngle}deg` },
                { translateX: size / 2 },
                { translateY: size / 2 },
                { rotate: `${hazardousAngle}deg` },
                { translateX: -size / 2 },
                { translateY: -size / 2 },
              ],
              zIndex: 1,
            },
          ]}
        />
      </View>
      
      {showLabels && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>
              Wet Waste {showPercentages && `(${wetPercentage}%)`}
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
            <Text style={styles.legendText}>
              Dry Waste {showPercentages && `(${dryPercentage}%)`}
            </Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>
              Hazardous {showPercentages && `(${hazardousPercentage}%)`}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chart: {
    position: 'relative',
    borderRadius: 100, // Make it a circle
    overflow: 'hidden',
  },
  segment: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    transformOrigin: 'center',
  },
  legend: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: colors.text,
  },
});