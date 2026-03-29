import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { UserRole } from '@/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Lock, Mail, User, UserPlus } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role: UserRole }>();
  const role = params.role || 'volunteer';
  
  const { signup, isLoading, language } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
    // Name validation
    if (!name) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    // Confirm password validation
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    try {
      await signup(name, email, password, role);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Signup Failed', 'Could not create account');
    }
  };

  const getRoleText = () => {
    switch (role) {
      case 'volunteer':
        return language === 'en' ? 'Volunteer' : language === 'hi' ? 'स्वयंसेवक' : 'स्वयंसेवक';
      case 'organizer':
        return language === 'en' ? 'Organizer' : language === 'hi' ? 'आयोजक' : 'आयोजक';
      case 'csr':
        return language === 'en' ? 'CSR Partner' : language === 'hi' ? 'सीएसआर पार्टनर' : 'सीएसआर भागीदार';
    }
  };

  const getSignupText = () => {
    switch (language) {
      case 'hi':
        return 'साइन अप करें';
      case 'mr':
        return 'साइन अप करा';
      default:
        return 'Sign Up';
    }
  };

  const getNameText = () => {
    switch (language) {
      case 'hi':
        return 'नाम';
      case 'mr':
        return 'नाव';
      default:
        return 'Name';
    }
  };

  const getEmailText = () => {
    switch (language) {
      case 'hi':
        return 'ईमेल';
      case 'mr':
        return 'ईमेल';
      default:
        return 'Email';
    }
  };

  const getPasswordText = () => {
    switch (language) {
      case 'hi':
        return 'पासवर्ड';
      case 'mr':
        return 'पासवर्ड';
      default:
        return 'Password';
    }
  };

  const getConfirmPasswordText = () => {
    switch (language) {
      case 'hi':
        return 'पासवर्ड की पुष्टि करें';
      case 'mr':
        return 'पासवर्ड पुष्टी करा';
      default:
        return 'Confirm Password';
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>{getSignupText()}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.roleContainer}>
          <Text style={styles.roleLabel}>{language === 'en' ? 'Signing up as' : language === 'hi' ? 'इस रूप में साइन अप कर रहे हैं' : 'असे साइन अप करत आहे'}</Text>
          <Text style={styles.roleValue}>{getRoleText()}</Text>
        </View>
        
        <Input
          label={getNameText()}
          placeholder={language === 'en' ? "Your full name" : language === 'hi' ? "आपका पूरा नाम" : "आपले पूर्ण नाव"}
          value={name}
          onChangeText={setName}
          error={nameError}
          leftIcon={<User size={20} color={colors.textLight} />}
        />
        
        <Input
          label={getEmailText()}
          placeholder="your.email@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={emailError}
          leftIcon={<Mail size={20} color={colors.textLight} />}
        />
        
        <Input
          label={getPasswordText()}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={passwordError}
          leftIcon={<Lock size={20} color={colors.textLight} />}
        />
        
        <Input
          label={getConfirmPasswordText()}
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          error={confirmPasswordError}
          leftIcon={<Lock size={20} color={colors.textLight} />}
        />
        
        <Button
          title={getSignupText()}
          onPress={handleSignup}
          isLoading={isLoading}
          style={styles.signupButton}
          leftIcon={<UserPlus size={20} color={colors.card} />}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  roleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'rgba(34, 139, 34, 0.1)',
    padding: 16,
    borderRadius: 8,
  },
  roleLabel: {
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  roleValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  signupButton: {
    marginTop: 24,
  },
});