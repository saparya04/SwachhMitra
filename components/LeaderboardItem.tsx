import { colors } from '@/constants/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { UserAvatar } from './UserAvatar';

interface LeaderboardItemProps {
  rank: number;
  name: string;
  score: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

export const LeaderboardItem: React.FC<LeaderboardItemProps> = ({
  rank,
  name,
  score,
  avatar,
  isCurrentUser = false,
}) => {
  // Get medal emoji based on rank
  const getMedalEmoji = () => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  const medal = getMedalEmoji();

  return (
    <View style={[
      styles.container,
      isCurrentUser && styles.currentUserContainer
    ]}>
      <View style={styles.rankContainer}>
        {medal ? (
          <Text style={styles.medal}>{medal}</Text>
        ) : (
          <Text style={styles.rank}>{rank}</Text>
        )}
      </View>
      
      <UserAvatar name={name} imageUrl={avatar} size={36} />
      
      <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
        {name}
      </Text>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.score}>{score} XP</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  currentUserContainer: {
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
  },
  rankContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 12,
  },
  rank: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  medal: {
    fontSize: 20,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
  },
  scoreContainer: {
    backgroundColor: colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  score: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
});