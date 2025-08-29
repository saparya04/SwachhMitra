import { colors } from '@/constants/colors';
import { Event } from '@/types';
import { useRouter } from 'expo-router';
import { Calendar, Clock, MapPin, Users } from 'lucide-react-native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';

interface EventCardProps {
  event: Event;
  onJoin?: () => void;
  isJoined?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onJoin,
  isJoined = false
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/events/${event.id}`);
  };

  // Get event type image
  const getEventImage = () => {
    switch (event.type) {
      case 'beach':
        return 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e';
      case 'park':
        return 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f';
      case 'campus':
        return 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f';
      case 'street':
        return 'https://images.unsplash.com/photo-1573108724029-4c46571d6490';
      default:
        return 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51';
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress}>
      <Card style={styles.card}>
        <Image 
          source={{ uri: getEventImage() }} 
          style={styles.image} 
          resizeMode="cover"
        />
        
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{event.name}</Text>
            <Badge 
              label={event.type.charAt(0).toUpperCase() + event.type.slice(1)} 
              variant="info" 
              size="small"
            />
          </View>
          
          <View style={styles.infoRow}>
            <MapPin size={16} color={colors.textLight} />
            <Text style={styles.infoText}>{event.location.address}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Calendar size={16} color={colors.textLight} />
            <Text style={styles.infoText}>{event.date}</Text>
            <Clock size={16} color={colors.textLight} style={styles.timeIcon} />
            <Text style={styles.infoText}>{event.time}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Users size={16} color={colors.textLight} />
            <Text style={styles.infoText}>
              {event.participants.length} / {event.maxParticipants || '∞'} participants
            </Text>
          </View>
          
          <View style={styles.footer}>
            <Text style={styles.organizer}>By {event.organizer}</Text>
            {onJoin && (
              <TouchableOpacity 
                style={[styles.joinButton, isJoined && styles.joinedButton]} 
                onPress={onJoin}
                disabled={isJoined}
              >
                <Text style={[styles.joinButtonText, isJoined && styles.joinedButtonText]}>
                  {isJoined ? 'Registered' : 'Join Event'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    flex: 1,
    marginRight: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 8,
  },
  timeIcon: {
    marginLeft: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  organizer: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  joinButtonText: {
    color: colors.card,
    fontWeight: '500',
    fontSize: 14,
  },
  joinedButton: {
    backgroundColor: colors.border,
  },
  joinedButtonText: {
    color: colors.textLight,
  },
});