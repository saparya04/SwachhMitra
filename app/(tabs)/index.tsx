import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { UserAvatar } from '@/components/UserAvatar';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useEventsStore } from '@/hooks/useEventsStore';
import { useRouter } from 'expo-router';
import { Award, Calendar, MapPin, TrendingUp } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { events, fetchEvents, joinEvent } = useEventsStore();
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  // Get upcoming events
  const upcomingEvents = events
    .filter(event => event.status === 'upcoming')
    .slice(0, 2);
  
  // Check if user has joined an event
  const hasJoinedEvent = (eventId: string) => {
    if (!user) return false;
    return user.eventsJoined?.includes(eventId) || false;
  };
  
  // Handle join event
  const handleJoinEvent = async (eventId: string) => {
    if (!user) return;
    await joinEvent(eventId, user.id);
  };
  
  // Render different dashboard based on user role
  const renderDashboard = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'volunteer':
        return renderVolunteerDashboard();
      case 'organizer':
        return renderOrganizerDashboard();
      case 'csr':
        return renderCSRDashboard();
      default:
        return null;
    }
  };
  
  // Volunteer Dashboard
  const renderVolunteerDashboard = () => {
    const progress = (user?.xp || 0) / 1000; // Example: 1000 XP for next level
    
    return (
      <>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <UserAvatar name={user?.name || ''} imageUrl={user?.avatar} size={60} showBorder />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <View style={styles.badgeContainer}>
                <Award size={16} color={colors.accent} />
                <Text style={styles.badgeText}>
                  {user?.badges?.filter(b => b.unlocked).length || 0} Badges
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.xpContainer}>
            <View style={styles.xpHeader}>
              <Text style={styles.xpLabel}>XP Progress</Text>
              <Text style={styles.xpValue}>{user?.xp || 0} XP</Text>
            </View>
            <ProgressBar progress={progress} />
          </View>
        </Card>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <Button 
            title="View All" 
            variant="ghost" 
            size="small" 
            onPress={() => router.push('/events')}
          />
        </View>
        
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onJoin={() => handleJoinEvent(event.id)}
              isJoined={hasJoinedEvent(event.id)}
            />
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No upcoming events found</Text>
            <Button 
              title="Find Events" 
              variant="primary" 
              size="medium" 
              style={styles.findButton}
              onPress={() => router.push('/events')}
            />
          </Card>
        )}
        
        <Card style={styles.impactCard}>
          <Text style={styles.impactTitle}>Your Impact</Text>
          <View style={styles.impactStats}>
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>
                {user?.eventsJoined?.length || 0}
              </Text>
              <Text style={styles.impactLabel}>Events Joined</Text>
            </View>
            <View style={styles.impactDivider} />
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>12</Text>
              <Text style={styles.impactLabel}>Waste Bags</Text>
            </View>
            <View style={styles.impactDivider} />
            <View style={styles.impactItem}>
              <Text style={styles.impactValue}>85%</Text>
              <Text style={styles.impactLabel}>Segregation</Text>
            </View>
          </View>
        </Card>
      </>
    );
  };
  
  // Organizer Dashboard
  const renderOrganizerDashboard = () => {
    const createdEvents = events.filter(event => event.organizerId === user?.id);
    
    return (
      <>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <UserAvatar name={user?.name || ''} imageUrl={user?.avatar} size={60} showBorder />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.organizerLabel}>Event Organizer</Text>
            </View>
          </View>
        </Card>
        
        <Card style={styles.statsCard}>
          <Text style={styles.statsTitle}>Your Impact</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{createdEvents.length}</Text>
              <Text style={styles.statLabel}>Events Created</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {createdEvents.reduce((total, event) => total + event.participants.length, 0)}
              </Text>
              <Text style={styles.statLabel}>Volunteers</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Waste Bags</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>78%</Text>
              <Text style={styles.statLabel}>Avg. Segregation</Text>
            </View>
          </View>
        </Card>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Events</Text>
          <Button 
            title="Create New" 
            variant="ghost" 
            size="small" 
            onPress={() => router.push('/events/create')}
          />
        </View>
        
        {createdEvents.length > 0 ? (
          createdEvents.slice(0, 2).map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>You haven't created any events yet</Text>
            <Button 
              title="Create Event" 
              variant="primary" 
              size="medium" 
              style={styles.findButton}
              onPress={() => router.push('/events/create')}
            />
          </Card>
        )}
      </>
    );
  };
  
  // CSR Dashboard
  const renderCSRDashboard = () => {
    const sponsoredEvents = events.filter(event => event.sponsorId === user?.id);
    
    return (
      <>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <UserAvatar name={user?.name || ''} imageUrl={user?.avatar} size={60} showBorder />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user?.name}</Text>
              <Text style={styles.organizerLabel}>CSR Partner</Text>
            </View>
          </View>
        </Card>
        
        <Card style={styles.impactCardCSR}>
          <Text style={styles.impactTitleCSR}>Your CSR Impact</Text>
          
          <View style={styles.csrStats}>
            <View style={styles.csrStatItem}>
              <View style={styles.csrStatIconContainer}>
                <Calendar size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.csrStatValue}>{sponsoredEvents.length}</Text>
                <Text style={styles.csrStatLabel}>Events Sponsored</Text>
              </View>
            </View>
            
            <View style={styles.csrStatItem}>
              <View style={styles.csrStatIconContainer}>
                <MapPin size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.csrStatValue}>
                  {sponsoredEvents.reduce((total, event) => total + event.participants.length, 0)}
                </Text>
                <Text style={styles.csrStatLabel}>Volunteer Hours</Text>
              </View>
            </View>
            
            <View style={styles.csrStatItem}>
              <View style={styles.csrStatIconContainer}>
                <TrendingUp size={24} color={colors.primary} />
              </View>
              <View>
                <Text style={styles.csrStatValue}>82%</Text>
                <Text style={styles.csrStatLabel}>Segregation Rate</Text>
              </View>
            </View>
          </View>
        </Card>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sponsored Events</Text>
          <Button 
            title="Find Events" 
            variant="ghost" 
            size="small" 
            onPress={() => router.push('/events')}
          />
        </View>
        
        {sponsoredEvents.length > 0 ? (
          sponsoredEvents.slice(0, 2).map(event => (
            <EventCard key={event.id} event={event} />
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>You haven't sponsored any events yet</Text>
            <Button 
              title="Find Events" 
              variant="primary" 
              size="medium" 
              style={styles.findButton}
              onPress={() => router.push('/events')}
            />
          </Card>
        )}
      </>
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {renderDashboard()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  organizerLabel: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  xpContainer: {
    marginTop: 8,
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  xpLabel: {
    fontSize: 14,
    color: colors.text,
  },
  xpValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
  },
  emptyCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 16,
    textAlign: 'center',
  },
  findButton: {
    minWidth: 150,
  },
  impactCard: {
    marginTop: 24,
  },
  impactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 16,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  impactItem: {
    flex: 1,
    alignItems: 'center',
  },
  impactValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
  },
  impactDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },
  statsCard: {
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    padding: 8,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  impactCardCSR: {
    marginBottom: 16,
  },
  impactTitleCSR: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 16,
  },
  csrStats: {
    gap: 16,
  },
  csrStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  csrStatIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34, 139, 34, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  csrStatValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
  },
  csrStatLabel: {
    fontSize: 14,
    color: colors.textLight,
  },
});