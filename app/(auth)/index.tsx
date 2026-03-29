import { Button } from '@/components/ui/Button';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  const { setLanguage, language } = useAuthStore();

  const handleRoleSelect = (role: 'volunteer' | 'organizer' | 'csr') => {
    router.push({
      pathname: '/signup',
      params: { role },
    });
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const toggleLanguage = () => {
    const nextLanguage = language === 'en' ? 'hi' : language === 'hi' ? 'mr' : 'en';
    setLanguage(nextLanguage);
  };

  const getLanguageText = () => {
    switch (language) {
      case 'hi':
        return 'हिंदी';
      case 'mr':
        return 'मराठी';
      default:
        return 'English';
    }
  };

  const getWelcomeText = () => {
    switch (language) {
      case 'hi':
        return 'स्वच्छमित्र में आपका स्वागत है';
      case 'mr':
        return 'स्वच्छमित्र मध्ये आपले स्वागत आहे';
      default:
        return 'Welcome to SwachhMitra';
    }
  };

  const getSubtitleText = () => {
    switch (language) {
      case 'hi':
        return 'एक साथ साफ करें, हमेशा के लिए प्रभाव डालें';
      case 'mr':
        return 'एकत्र स्वच्छ करा, कायमचा प्रभाव पाडा';
      default:
        return 'Clean Together, Impact Forever';
    }
  };

  const getContinueAsText = () => {
    switch (language) {
      case 'hi':
        return 'इस रूप में जारी रखें';
      case 'mr':
        return 'असे सुरू ठेवा';
      default:
        return 'Continue as';
    }
  };

  const getRoleText = (role: string) => {
    switch (language) {
      case 'hi':
        return role === 'volunteer' ? 'स्वयंसेवक' : role === 'organizer' ? 'आयोजक' : 'सीएसआर पार्टनर';
      case 'mr':
        return role === 'volunteer' ? 'स्वयंसेवक' : role === 'organizer' ? 'आयोजक' : 'सीएसआर भागीदार';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  const getLoginText = () => {
    switch (language) {
      case 'hi':
        return 'पहले से ही एक खाता है? लॉग इन करें';
      case 'mr':
        return 'आधीपासून खाते आहे? लॉग इन करा';
      default:
        return 'Already have an account? Log in';
    }
  };

  return (
    <LinearGradient
      colors={[colors.primary, '#1a6b1a']}
      style={styles.container}
    >
      <StatusBar style="light" />
      
      <TouchableOpacity style={styles.languageButton} onPress={toggleLanguage}>
        <Text style={styles.languageButtonText}>{getLanguageText()}</Text>
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Text style={styles.logoText}>🌱</Text>
        <Text style={styles.title}>{getWelcomeText()}</Text>
        <Text style={styles.subtitle}>{getSubtitleText()}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.continueText}>{getContinueAsText()}</Text>
        
        <View style={styles.roleButtons}>
          <Button
            title={getRoleText('volunteer')}
            variant="secondary"
            size="large"
            style={styles.roleButton}
            onPress={() => handleRoleSelect('volunteer')}
          />
          
          <Button
            title={getRoleText('organizer')}
            variant="secondary"
            size="large"
            style={styles.roleButton}
            onPress={() => handleRoleSelect('organizer')}
          />
          
          <Button
            title={getRoleText('csr')}
            variant="secondary"
            size="large"
            style={styles.roleButton}
            onPress={() => handleRoleSelect('csr')}
          />
        </View>
        
        <TouchableOpacity style={styles.loginLink} onPress={handleLogin}>
          <Text style={styles.loginText}>{getLoginText()}</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  languageButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  languageButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginTop: 100,
  },
  logoText: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    marginBottom: 50,
  },
  continueText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 24,
  },
  roleButtons: {
    gap: 16,
  },
  roleButton: {
    width: '100%',
  },
  loginLink: {
    marginTop: 32,
    alignItems: 'center',
  },
  loginText: {
    color: 'white',
    fontSize: 16,
  },
});