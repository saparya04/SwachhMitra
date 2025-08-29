import { EventCard } from '@/components/EventCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useEventsStore } from '@/hooks/useEventsStore';
import { useRouter } from 'expo-router';
import { Filter, Plus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function EventsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { events, filteredEvents, fetchEvents, filterEvents, joinEvent } = useEventsStore();
  
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  // Filter types
  const filterTypes = [
    { id: 'all', label: 'All' },
    { id: 'beach', label: 'Beach' },
    { id: 'park', label: 'Park' },
    { id: 'campus', label: 'Campus' },
    { id: 'street', label: 'Street' },
  ];
  
  // Distance filters
  const distanceFilters = [
    { id: '5', label: 'Within 5 km' },
    { id: '10', label: 'Within 10 km' },
    { id: '20', label: 'Within 20 km' },
  ];
  
  // Handle filter change
  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    
    if (filterId === 'all') {
      filterEvents({});
    } else {
      filterEvents({ type: filterId });
    }
  };
  
  // Handle distance filter
  const handleDistanceFilter = (distance: string) => {
    filterEvents({ distance: parseInt(distance) });
    setShowFilters(false);
  };
  
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
  
  // Render content based on user role
  const renderContent = () => {
    if (!user) return null;
    
    // For organizers, show a create button
    const showCreateButton = user.role === 'organizer';
    
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.title}>Cleanup Events</Text>
          
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Filter size={20} color={colors.text} />
            </TouchableOpacity>
            
            {showCreateButton && (
              <Button
                title="Create"
                size="small"
                leftIcon={<Plus size={16} color={colors.card} />}
                onPress={() => router.push('/events/create')}
                style={styles.createButton}
              />
            )}
          </View>
        </View>
        
        {showFilters && (
          <Card style={styles.filtersCard}>
            <Text style={styles.filterTitle}>Distance</Text>
            <View style={styles.filterOptions}>
              {distanceFilters.map(filter => (
                <TouchableOpacity
                  key={filter.id}
                  style={styles.filterOption}
                  onPress={() => handleDistanceFilter(filter.id)}
                >
                  <Text style={styles.filterOptionText}>{filter.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        )}
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterTabs}
          contentContainerStyle={styles.filterTabsContent}
        >
          {filterTypes.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterTab,
                activeFilter === filter.id && styles.activeFilterTab,
              ]}
              onPress={() => handleFilterChange(filter.id)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === filter.id && styles.activeFilterTabText,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard 
              key={event.id} 
              event={event} 
              onJoin={() => handleJoinEvent(event.id)}
              isJoined={hasJoinedEvent(event.id)}
            />
          ))
        ) : (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyText}>No events found</Text>
            {user.role === 'organizer' && (
              <Button 
                title="Create Event" 
                variant="primary" 
                size="medium" 
                style={styles.createEventButton}
                onPress={() => router.push('/events/create')}
              />
            )}
          </Card>
        )}
      </>
    );
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {renderContent()}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textDark,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.border,
    marginRight: 8,
  },
  createButton: {
    paddingHorizontal: 12,
  },
  filtersCard: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(34, 139, 34, 0.1)',
  },
  filterOptionText: {
    fontSize: 14,
    color: colors.primary,
  },
  filterTabs: {
    marginBottom: 16,
  },
  filterTabsContent: {
    paddingRight: 16,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    color: colors.text,
  },
  activeFilterTabText: {
    color: colors.card,
    fontWeight: '500',
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
  },
  createEventButton: {
    minWidth: 150,
  },
});