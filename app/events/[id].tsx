import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UserAvatar } from '@/components/UserAvatar';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useEventsStore } from '@/hooks/useEventsStore';
import { Event } from '@/types';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar, Clock, MapPin, QrCode, Share2, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const { events, joinEvent } = useEventsStore();
  
  const [event, setEvent] = useState<Event | null>(null);
  const [showQR, setShowQR] = useState(false);
  
  useEffect(() => {
    if (id && events.length > 0) {
      const foundEvent = events.find(e => e.id === id);
      if (foundEvent) {
        setEvent(foundEvent);
      }
    }
  }, [id, events]);
  
  // Check if user has joined the event
  const hasJoined = () => {
    if (!user || !event) return false;
    return event.participants.includes(user.id);
  };
  
  // Handle join event
  const handleJoinEvent = async () => {
    if (!user || !event) return;
    
    try {
      await joinEvent(event.id, user.id);
      Alert.alert('Success', 'You have successfully joined the event');
    } catch (error) {
      Alert.alert('Error', 'Failed to join the event');
    }
  };
  
  // Handle share event
  const handleShareEvent = () => {
    // In a real app, this would share the event
    Alert.alert('Share', 'Sharing functionality would be implemented here');
  };
  
  // Get event type image
  const getEventImage = () => {
    if (!event) return '';
    
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
  
  if (!event) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading event details...</Text>
      </View>
    );
  }
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: event.name,
          headerRight: () => (
            <TouchableOpacity style={styles.shareButton} onPress={handleShareEvent}>
              <Share2 size={20} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Image source={{ uri: getEventImage() }} style={styles.image} />
        
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{event.name}</Text>
            <Badge 
              label={event.type.charAt(0).toUpperCase() + event.type.slice(1)} 
              variant="info" 
            />
          </View>
          
          <Text style={styles.description}>{event.description}</Text>
        </View>
        
        <Card style={styles.detailsCard}>
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Calendar size={20} color={colors.primary} />
            </View>
            <Text style={styles.detailText}>{event.date}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Clock size={20} color={colors.primary} />
            </View>
            <Text style={styles.detailText}>{event.time}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <MapPin size={20} color={colors.primary} />
            </View>
            <Text style={styles.detailText}>{event.location.address}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <View style={styles.detailIconContainer}>
              <Users size={20} color={colors.primary} />
            </View>
            <Text style={styles.detailText}>
              {event.participants.length} / {event.maxParticipants || '∞'} participants
            </Text>
          </View>
        </Card>
        
        <Card style={styles.organizerCard}>
          <Text style={styles.sectionTitle}>Organized by</Text>
          <View style={styles.organizerInfo}>
            <UserAvatar name={event.organizer} size={40} />
            <Text style={styles.organizerName}>{event.organizer}</Text>
          </View>
          
          {event.sponsor && (
            <>
              <Text style={[styles.sectionTitle, styles.sponsorTitle]}>Sponsored by</Text>
              <View style={styles.organizerInfo}>
                <UserAvatar name={event.sponsor} size={40} />
                <Text style={styles.organizerName}>{event.sponsor}</Text>
              </View>
            </>
          )}
        </Card>
        
        {showQR && event.qrCode && (
          <Card style={styles.qrCard}>
            <Text style={styles.qrTitle}>Event Check-in QR Code</Text>
            <Text style={styles.qrSubtitle}>Scan this QR code at the event location</Text>
            <Image source={{ uri: event.qrCode }} style={styles.qrImage} />
          </Card>
        )}
        
        <View style={styles.actions}>
          {user?.role === 'volunteer' && (
            <Button
              title={hasJoined() ? "You're Registered" : "Join Event"}
              disabled={hasJoined()}
              onPress={handleJoinEvent}
              style={[styles.actionButton, hasJoined() && styles.joinedButton]}
              textStyle={hasJoined() && styles.joinedButtonText}
            />
          )}
          
          {hasJoined() && (
            <Button
              title={showQR ? "Hide QR Code" : "Show QR Code"}
              variant="outline"
              leftIcon={<QrCode size={20} color={colors.primary} />}
              onPress={() => setShowQR(!showQR)}
              style={styles.qrButton}
            />
          )}
          
          {user?.role === 'csr' && !event.sponsorId && (
            <Button
              title="Sponsor Event"
              style={styles.actionButton}
            />
          )}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textLight,
  },
  shareButton: {
    padding: 8,
    marginRight: 8,
  },
  image: {
    width: '100%',
    height: 200,
  },
  header: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textDark,
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  detailsCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(34, 139, 34, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  detailText: {
    fontSize: 16,
    color: colors.text,
  },
  organizerCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  sponsorTitle: {
    marginTop: 16,
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerName: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  qrCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  qrSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    textAlign: 'center',
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    gap: 16,
  },
  actionButton: {
    flex: 1,
  },
  joinedButton: {
    backgroundColor: colors.border,
  },
  joinedButtonText: {
    color: colors.textLight,
  },
  qrButton: {
    flex: 1,
  },
});