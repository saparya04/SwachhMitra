import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Lock, LogIn, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, loginWithGoogle, isLoading, language } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    
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
    
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', 'Could not login with Google');
    }
  };

  const getLoginText = () => {
    switch (language) {
      case 'hi':
        return 'लॉग इन करें';
      case 'mr':
        return 'लॉग इन करा';
      default:
        return 'Log In';
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

  const getGoogleText = () => {
    switch (language) {
      case 'hi':
        return 'Google के साथ जारी रखें';
      case 'mr':
        return 'Google सह सुरू ठेवा';
      default:
        return 'Continue with Google';
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
        <Text style={styles.title}>{getLoginText()}</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
        
        <Button
          title={getLoginText()}
          onPress={handleLogin}
          isLoading={isLoading}
          style={styles.loginButton}
          leftIcon={<LogIn size={20} color={colors.card} />}
        />
        
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>
        
        <Button
          title={getGoogleText()}
          variant="outline"
          onPress={handleGoogleLogin}
          leftIcon={
            <Text style={styles.googleIcon}>G</Text>
          }
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
  },
  loginButton: {
    marginTop: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textLight,
  },
  googleIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
});