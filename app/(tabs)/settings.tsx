import { NotificationItem } from '@/components/NotificationItem';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { UserAvatar } from '@/components/UserAvatar';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useNotificationsStore } from '@/hooks/useNotificationsStore';
import { useRouter } from 'expo-router';
import {
    Bell,
    ChevronRight,
    Globe,
    HelpCircle,
    LogOut,
    Moon,
    Shield,
    User
} from 'lucide-react-native';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout, language, setLanguage, isLoading } = useAuthStore();
  const { notifications, markAsRead, markAllAsRead, fetchNotifications } = useNotificationsStore();
  
  const [darkMode, setDarkMode] = React.useState(false);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  
  React.useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user]);
  
  // Handle notification press
  const handleNotificationPress = (notificationId: string) => {
    markAsRead(notificationId);
  };
  
  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    if (user) {
      markAllAsRead(user.id);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // Force navigation to auth screen after logout
              router.replace('/(auth)');
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };
  
  // Handle language change
  const handleLanguageChange = () => {
    const nextLanguage = language === 'en' ? 'hi' : language === 'hi' ? 'mr' : 'en';
    setLanguage(nextLanguage);
  };
  
  // Get language text
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
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Section */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <UserAvatar name={user?.name || ''} imageUrl={user?.avatar} size={60} showBorder />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.name}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
        </View>
        
        <Button
          title="Edit Profile"
          variant="outline"
          leftIcon={<User size={20} color={colors.primary} />}
          style={styles.editProfileButton}
        />
      </Card>
      
      {/* Notifications Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        {notifications.length > 0 && (
          <TouchableOpacity onPress={handleMarkAllAsRead}>
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {notifications.length > 0 ? (
        <Card style={styles.notificationsCard}>
          {notifications.slice(0, 3).map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onPress={() => handleNotificationPress(notification.id)}
            />
          ))}
          
          {notifications.length > 3 && (
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View all notifications</Text>
            </TouchableOpacity>
          )}
        </Card>
      ) : (
        <Card style={styles.emptyNotificationsCard}>
          <Bell size={32} color={colors.textLight} />
          <Text style={styles.emptyNotificationsText}>
            You don't have any notifications
          </Text>
        </Card>
      )}
      
      {/* Settings Section */}
      <Text style={[styles.sectionTitle, styles.settingsSectionTitle]}>Settings</Text>
      
      <Card style={styles.settingsCard}>
        <TouchableOpacity style={styles.settingItem} onPress={handleLanguageChange}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIconContainer}>
              <Globe size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Language</Text>
          </View>
          <View style={styles.settingRight}>
            <Text style={styles.settingValue}>{getLanguageText()}</Text>
            <ChevronRight size={20} color={colors.textLight} />
          </View>
        </TouchableOpacity>
        
        <View style={styles.settingDivider} />
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIconContainer}>
              <Moon size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
        
        <View style={styles.settingDivider} />
        
        <View style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIconContainer}>
              <Bell size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Push Notifications</Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.card}
          />
        </View>
      </Card>
      
      {/* Help & Support Section */}
      <Card style={styles.supportCard}>
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIconContainer}>
              <HelpCircle size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Help & Support</Text>
          </View>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
        
        <View style={styles.settingDivider} />
        
        <TouchableOpacity style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <View style={styles.settingIconContainer}>
              <Shield size={20} color={colors.primary} />
            </View>
            <Text style={styles.settingText}>Privacy Policy</Text>
          </View>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>
      </Card>
      
      {/* Logout Button */}
      <Button
        title="Logout"
        variant="outline"
        leftIcon={<LogOut size={20} color={colors.error} />}
        style={styles.logoutButton}
        textStyle={styles.logoutButtonText}
        onPress={handleLogout}
        isLoading={isLoading}
      />
      
      <Text style={styles.versionText}>SwachhMitra v1.0.0</Text>
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
    marginBottom: 24,
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
  profileEmail: {
    fontSize: 14,
    color: colors.textLight,
  },
  editProfileButton: {
    alignSelf: 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
  },
  settingsSectionTitle: {
    marginTop: 24,
    marginBottom: 12,
  },
  markAllText: {
    fontSize: 14,
    color: colors.primary,
  },
  notificationsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  viewAllButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  emptyNotificationsCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyNotificationsText: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 12,
  },
  settingsCard: {
    marginBottom: 16,
  },
  supportCard: {
    marginBottom: 24,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(34, 139, 34, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: colors.text,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    fontSize: 14,
    color: colors.textLight,
    marginRight: 8,
  },
  settingDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  logoutButton: {
    borderColor: colors.error,
  },
  logoutButtonText: {
    color: colors.error,
  },
  versionText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 16,
  },
});