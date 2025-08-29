import { colors } from '@/constants/colors';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Camera, RotateCcw, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function QRScannerModal() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (scanned && result) {
      // Simulate processing the QR code
      const timer = setTimeout(() => {
        router.back();
        // In a real app, you would navigate to the appropriate screen or update state
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [scanned, result]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to scan QR codes</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    setResult(data);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <X size={24} color="white" />
      </TouchableOpacity>
      
      {!scanned ? (
        <>
          <CameraView
            style={styles.camera}
            facing={facing}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          >
            <View style={styles.overlay}>
              <View style={styles.scanArea} />
            </View>
            
            <View style={styles.controls}>
              <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
                <RotateCcw size={24} color="white" />
              </TouchableOpacity>
            </View>
          </CameraView>
          
          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              Position the QR code within the square to scan
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.resultContainer}>
          <Camera size={48} color={colors.primary} />
          <Text style={styles.resultTitle}>QR Code Scanned!</Text>
          <Text style={styles.resultText}>
            {result?.substring(0, 30)}
            {result && result.length > 30 ? '...' : ''}
          </Text>
          <Text style={styles.processingText}>Processing...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  message: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    margin: 24,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'center',
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    padding: 16,
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: 16,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  processingText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});