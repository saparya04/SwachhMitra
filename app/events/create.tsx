import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useEventsStore } from '@/hooks/useEventsStore';
import { Stack, useRouter } from 'expo-router';
import { Calendar, Clock, FileText, MapPin, Tag, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CreateEventScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { createEvent, isLoading } = useEventsStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<'beach' | 'park' | 'campus' | 'street' | 'other'>('other');
  const [maxParticipants, setMaxParticipants] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [locationError, setLocationError] = useState('');
  
  // Event types
  const eventTypes = [
    { id: 'beach', label: 'Beach' },
    { id: 'park', label: 'Park' },
    { id: 'campus', label: 'Campus' },
    { id: 'street', label: 'Street' },
    { id: 'other', label: 'Other' },
  ];
  
  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    if (!name) {
      setNameError('Event name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!description) {
      setDescriptionError('Description is required');
      isValid = false;
    } else {
      setDescriptionError('');
    }
    
    if (!date) {
      setDateError('Date is required');
      isValid = false;
    } else {
      setDateError('');
    }
    
    if (!time) {
      setTimeError('Time is required');
      isValid = false;
    } else {
      setTimeError('');
    }
    
    if (!location) {
      setLocationError('Location is required');
      isValid = false;
    } else {
      setLocationError('');
    }
    
    return isValid;
  };
  
  // Handle create event
  const handleCreateEvent = async () => {
    if (!validateForm() || !user) return;
    
    try {
      const newEvent = await createEvent({
        name,
        description,
        date,
        time,
        location: {
          address: location,
          latitude: 19.0760, // Mock coordinates
          longitude: 72.8777,
        },
        type,
        organizerId: user.id,
        organizer: user.name,
        participants: [],
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
        status: 'upcoming',
      });
      
      Alert.alert('Success', 'Event created successfully');
      router.push(`/events/${newEvent.id}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to create event');
    }
  };
  
  return (
    <>
      <Stack.Screen options={{ title: 'Create Event' }} />
      
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          <Card style={styles.formCard}>
            <Input
              label="Event Name"
              placeholder="Enter event name"
              value={name}
              onChangeText={setName}
              error={nameError}
              leftIcon={<FileText size={20} color={colors.textLight} />}
            />
            
            <Input
              label="Description"
              placeholder="Enter event description"
              value={description}
              onChangeText={setDescription}
              error={descriptionError}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.textArea}
            />
            
            <Input
              label="Date"
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              error={dateError}
              leftIcon={<Calendar size={20} color={colors.textLight} />}
            />
            
            <Input
              label="Time"
              placeholder="HH:MM - HH:MM"
              value={time}
              onChangeText={setTime}
              error={timeError}
              leftIcon={<Clock size={20} color={colors.textLight} />}
            />
            
            <Input
              label="Location"
              placeholder="Enter event location"
              value={location}
              onChangeText={setLocation}
              error={locationError}
              leftIcon={<MapPin size={20} color={colors.textLight} />}
            />
            
            <Text style={styles.label}>Event Type</Text>
            <View style={styles.typeContainer}>
              {eventTypes.map(eventType => (
                <TouchableOpacity
                  key={eventType.id}
                  style={[
                    styles.typeButton,
                    type === eventType.id && styles.selectedTypeButton,
                  ]}
                  onPress={() => setType(eventType.id as any)}
                >
                  <Text
                    style={[
                      styles.typeButtonText,
                      type === eventType.id && styles.selectedTypeButtonText,
                    ]}
                  >
                    {eventType.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Input
              label="Maximum Participants (Optional)"
              placeholder="Enter maximum number of participants"
              value={maxParticipants}
              onChangeText={setMaxParticipants}
              keyboardType="numeric"
              leftIcon={<Tag size={20} color={colors.textLight} />}
            />
          </Card>
          
          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="outline"
              leftIcon={<X size={20} color={colors.primary} />}
              onPress={() => router.back()}
              style={styles.cancelButton}
            />
            
            <Button
              title="Create Event"
              onPress={handleCreateEvent}
              isLoading={isLoading}
              style={styles.createButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  formCard: {
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: colors.text,
  },
  typeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedTypeButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedTypeButtonText: {
    color: colors.card,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
  },
  createButton: {
    flex: 2,
  },
});