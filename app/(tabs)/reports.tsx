import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { WasteChart } from '@/components/WasteChart';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { mockEvents } from '@/mocks/events';
import { Download, FileText, MapPin, Share2, TrendingUp, Users } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ReportsScreen() {
  const { user } = useAuthStore();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  
  // Get events based on user role
  const getUserEvents = () => {
    if (!user) return [];
    
    if (user.role === 'organizer') {
      return mockEvents.filter(event => event.organizerId === user.id);
    } else if (user.role === 'csr') {
      return mockEvents.filter(event => event.sponsorId === user.id);
    }
    
    return [];
  };
  
  const events = getUserEvents();
  
  // Get selected event
  const getSelectedEvent = () => {
    return events.find(event => event.id === selectedEvent);
  };
  
  // Handle generate report
  const handleGenerateReport = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 2000);
  };
  
  // Handle share report
  const handleShareReport = () => {
    // In a real app, this would share the report
    console.log('Sharing report...');
  };
  
  // Handle download report
  const handleDownloadReport = () => {
    // In a real app, this would download the report
    console.log('Downloading report...');
  };
  
  // Render event list
  const renderEventList = () => {
    return (
      <View style={styles.eventListContainer}>
        <Text style={styles.sectionTitle}>Select Event</Text>
        <Text style={styles.sectionSubtitle}>
          Choose an event to generate or view its impact report
        </Text>
        
        <ScrollView style={styles.eventList}>
          {events.length > 0 ? (
            events.map(event => (
              <TouchableOpacity
                key={event.id}
                style={[
                  styles.eventItem,
                  selectedEvent === event.id && styles.selectedEventItem,
                ]}
                onPress={() => {
                  setSelectedEvent(event.id);
                  setReportGenerated(false);
                }}
              >
                <View style={styles.eventInfo}>
                  <Text 
                    style={[
                      styles.eventName,
                      selectedEvent === event.id && styles.selectedEventName,
                    ]}
                  >
                    {event.name}
                  </Text>
                  <Text 
                    style={[
                      styles.eventDate,
                      selectedEvent === event.id && styles.selectedEventDate,
                    ]}
                  >
                    {event.date}
                  </Text>
                </View>
                {selectedEvent === event.id && (
                  <View style={styles.selectedIndicator} />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noEventsText}>No events found</Text>
          )}
        </ScrollView>
      </View>
    );
  };
  
  // Render report content
  const renderReportContent = () => {
    const event = getSelectedEvent();
    
    if (!event) {
      return (
        <Card style={styles.noSelectionCard}>
          <FileText size={48} color={colors.textLight} />
          <Text style={styles.noSelectionText}>
            Select an event to view or generate its report
          </Text>
        </Card>
      );
    }
    
    if (isGenerating) {
      return (
        <Card style={styles.generatingCard}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.generatingText}>
            Generating report...
          </Text>
          <Text style={styles.generatingSubtext}>
            Our AI is analyzing the event data and creating a comprehensive impact report
          </Text>
        </Card>
      );
    }
    
    if (!reportGenerated) {
      return (
        <Card style={styles.reportCard}>
          <Text style={styles.reportTitle}>{event.name}</Text>
          <Text style={styles.reportDate}>{event.date}</Text>
          
          <View style={styles.reportStats}>
            <View style={styles.reportStat}>
              <View style={styles.reportStatIcon}>
                <Users size={24} color={colors.primary} />
              </View>
              <Text style={styles.reportStatValue}>{event.participants.length}</Text>
              <Text style={styles.reportStatLabel}>Participants</Text>
            </View>
            
            <View style={styles.reportStat}>
              <View style={styles.reportStatIcon}>
                <MapPin size={24} color={colors.primary} />
              </View>
              <Text style={styles.reportStatValue}>{event.location.address.split(',')[0]}</Text>
              <Text style={styles.reportStatLabel}>Location</Text>
            </View>
            
            <View style={styles.reportStat}>
              <View style={styles.reportStatIcon}>
                <TrendingUp size={24} color={colors.primary} />
              </View>
              <Text style={styles.reportStatValue}>
                {event.wasteCollected ? 
                  `${Math.round((event.wasteCollected.dry / (event.wasteCollected.wet + event.wasteCollected.dry + event.wasteCollected.hazardous)) * 100)}%` : 
                  'N/A'}
              </Text>
              <Text style={styles.reportStatLabel}>Segregation</Text>
            </View>
          </View>
          
          <Button
            title="Generate Impact Report"
            onPress={handleGenerateReport}
            style={styles.generateButton}
          />
        </Card>
      );
    }
    
    return (
      <Card style={styles.reportCard}>
        <Text style={styles.reportTitle}>{event.name} - Impact Report</Text>
        <Text style={styles.reportDate}>{event.date}</Text>
        
        {event.wasteCollected && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Waste Segregation Results</Text>
            <WasteChart data={event.wasteCollected} size={180} />
          </View>
        )}
        
        <View style={styles.reportContent}>
          <Text style={styles.reportSectionTitle}>Executive Summary</Text>
          <Text style={styles.reportText}>
            The {event.name} was successfully conducted on {event.date} with {event.participants.length} volunteers. 
            The event resulted in significant waste collection and proper segregation, contributing to cleaner 
            surroundings and increased awareness about waste management.
          </Text>
          
          <Text style={styles.reportSectionTitle}>Impact Highlights</Text>
          <View style={styles.reportBullet}>
            <View style={styles.bulletDot} />
            <Text style={styles.reportText}>
              Collected approximately 45 kg of waste from {event.location.address}
            </Text>
          </View>
          <View style={styles.reportBullet}>
            <View style={styles.bulletDot} />
            <Text style={styles.reportText}>
              Achieved {event.wasteCollected ? 
                `${Math.round((event.wasteCollected.dry / (event.wasteCollected.wet + event.wasteCollected.dry + event.wasteCollected.hazardous)) * 100)}%` : 
                '65%'} segregation efficiency
            </Text>
          </View>
          <View style={styles.reportBullet}>
            <View style={styles.bulletDot} />
            <Text style={styles.reportText}>
              Engaged {event.participants.length} community members in active cleanup
            </Text>
          </View>
          <View style={styles.reportBullet}>
            <View style={styles.bulletDot} />
            <Text style={styles.reportText}>
              Conducted on-site waste segregation training for all participants
            </Text>
          </View>
        </View>
        
        <View style={styles.reportActions}>
          <Button
            title="Share"
            variant="outline"
            leftIcon={<Share2 size={20} color={colors.primary} />}
            onPress={handleShareReport}
            style={styles.reportActionButton}
          />
          
          <Button
            title="Download PDF"
            leftIcon={<Download size={20} color={colors.card} />}
            onPress={handleDownloadReport}
            style={styles.reportActionButton}
          />
        </View>
      </Card>
    );
  };
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {renderEventList()}
        {renderReportContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  eventListContainer: {
    marginBottom: 24,
  },
  eventList: {
    maxHeight: 200,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.card,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedEventItem: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(34, 139, 34, 0.05)',
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textDark,
    marginBottom: 4,
  },
  selectedEventName: {
    color: colors.primary,
  },
  eventDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  selectedEventDate: {
    color: colors.primary,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  noEventsText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    padding: 16,
  },
  noSelectionCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  noSelectionText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
  generatingCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  generatingText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  generatingSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  reportCard: {
    padding: 16,
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  reportStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  reportStat: {
    alignItems: 'center',
  },
  reportStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34, 139, 34, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportStatValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  reportStatLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  generateButton: {
    marginTop: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 16,
  },
  reportContent: {
    marginBottom: 24,
  },
  reportSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
    marginTop: 16,
  },
  reportText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  reportBullet: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 8,
    marginRight: 8,
  },
  reportActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  reportActionButton: {
    flex: 1,
  },
});