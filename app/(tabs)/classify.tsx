import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { WasteChart } from '@/components/WasteChart';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useWasteClassificationStore } from '@/hooks/useWasteClassificationStore';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera, RefreshCw, Upload } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Image, Platform, StyleSheet, Text, View } from 'react-native';

export default function ClassifyScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { classifyWaste, isLoading, currentClassification } = useWasteClassificationStore();
  
  const [image, setImage] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Request camera permissions
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera permissions to make this work!');
        return false;
      }
      return true;
    }
    return true;
  };
  
  // Take a photo
  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;
    
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };
  
  // Pick an image from gallery
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        setShowResults(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  // Classify waste
  const handleClassify = async () => {
    if (!image || !user) return;
    
    try {
      // For demo, we'll use a mock event ID
      const eventId = 'e1';
      
      await classifyWaste(image, eventId, user.id);
      setShowResults(true);
    } catch (error) {
      console.error('Error classifying waste:', error);
      Alert.alert('Error', 'Failed to classify waste');
    }
  };
  
  // Reset classification
  const handleReset = () => {
    setImage(null);
    setShowResults(false);
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waste Classification</Text>
      <Text style={styles.subtitle}>
        Take a photo of waste to classify it into wet, dry, and hazardous categories
      </Text>
      
      {!image ? (
        <Card style={styles.uploadCard}>
          <View style={styles.uploadContent}>
            <Camera size={48} color={colors.primary} />
            <Text style={styles.uploadText}>Take a photo or upload an image</Text>
            
            <View style={styles.uploadButtons}>
              <Button
                title="Take Photo"
                leftIcon={<Camera size={20} color={colors.card} />}
                onPress={takePhoto}
                style={styles.uploadButton}
              />
              
              <Button
                title="Upload"
                variant="outline"
                leftIcon={<Upload size={20} color={colors.primary} />}
                onPress={pickImage}
                style={styles.uploadButton}
              />
            </View>
          </View>
        </Card>
      ) : (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          
          {!showResults ? (
            <View style={styles.imageActions}>
              <Button
                title="Classify"
                onPress={handleClassify}
                isLoading={isLoading}
                style={styles.classifyButton}
              />
              
              <Button
                title="Reset"
                variant="outline"
                leftIcon={<RefreshCw size={20} color={colors.primary} />}
                onPress={handleReset}
                style={styles.resetButton}
              />
            </View>
          ) : (
            <Card style={styles.resultsCard}>
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsTitle}>Classification Results</Text>
                <Badge 
                  label={currentClassification?.isWellSegregated ? 'Well Segregated' : 'Mixed Waste'} 
                  variant={currentClassification?.isWellSegregated ? 'success' : 'warning'}
                />
              </View>
              
              {currentClassification && (
                <WasteChart data={currentClassification.classification} size={200} />
              )}
              
              <Text style={styles.resultsDescription}>
                {currentClassification?.isWellSegregated 
                  ? 'Great job! This waste is well segregated with a good balance of dry recyclables.'
                  : 'This waste could be better segregated. Try to separate dry recyclables from wet waste.'}
              </Text>
              
              <Button
                title="Classify Another"
                variant="outline"
                leftIcon={<RefreshCw size={20} color={colors.primary} />}
                onPress={handleReset}
                style={styles.anotherButton}
              />
            </Card>
          )}
        </View>
      )}
      
      <Card style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Waste Segregation Tips</Text>
        <View style={styles.tipItem}>
          <View style={[styles.tipDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles.tipText}>
            <Text style={styles.tipHighlight}>Wet Waste:</Text> Food scraps, garden waste, soiled paper
          </Text>
        </View>
        <View style={styles.tipItem}>
          <View style={[styles.tipDot, { backgroundColor: '#2196F3' }]} />
          <Text style={styles.tipText}>
            <Text style={styles.tipHighlight}>Dry Waste:</Text> Paper, plastic, metal, glass, cardboard
          </Text>
        </View>
        <View style={styles.tipItem}>
          <View style={[styles.tipDot, { backgroundColor: '#F44336' }]} />
          <Text style={styles.tipText}>
            <Text style={styles.tipHighlight}>Hazardous:</Text> Batteries, chemicals, medical waste, e-waste
          </Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  uploadCard: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadContent: {
    alignItems: 'center',
    padding: 16,
  },
  uploadText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
    marginBottom: 24,
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  uploadButton: {
    minWidth: 130,
  },
  imageContainer: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  classifyButton: {
    flex: 2,
  },
  resetButton: {
    flex: 1,
  },
  resultsCard: {
    padding: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
  },
  resultsDescription: {
    fontSize: 14,
    color: colors.text,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  anotherButton: {
    alignSelf: 'center',
  },
  tipsCard: {
    marginTop: 8,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  tipHighlight: {
    fontWeight: '600',
  },
});