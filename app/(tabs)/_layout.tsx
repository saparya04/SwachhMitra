import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useNotificationsStore } from '@/hooks/useNotificationsStore';
import { Tabs } from 'expo-router';
import { Award, Calendar, Camera, Home, Settings } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TabLayout() {
  const { user } = useAuthStore();
  const { unreadCount, fetchNotifications } = useNotificationsStore();
  
  React.useEffect(() => {
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user]);

  // Determine which tabs to show based on user role
  const showVolunteerTabs = user?.role === 'volunteer';
  const showOrganizerTabs = user?.role === 'organizer';
  const showCSRTabs = user?.role === 'csr';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          borderTopColor: colors.border,
        },
        headerShown: true,
      }}
    >
      {/* Home Tab - All users */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />

      {/* Events Tab - All users (but different content) */}
      <Tabs.Screen
        name="events"
        options={{
          title: 'Events',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />

      {/* Classify Tab - Only for volunteers */}
      {showVolunteerTabs && (
        <Tabs.Screen
          name="classify"
          options={{
            title: 'Classify',
            tabBarIcon: ({ color }) => <Camera size={24} color={color} />,
          }}
        />
      )}

      {/* Rewards Tab - Only for volunteers */}
      {showVolunteerTabs && (
        <Tabs.Screen
          name="rewards"
          options={{
            title: 'Rewards',
            tabBarIcon: ({ color }) => <Award size={24} color={color} />,
          }}
        />
      )}

      {/* Reports Tab - Only for organizers and CSR partners */}
      {(showOrganizerTabs || showCSRTabs) && (
        <Tabs.Screen
          name="reports"
          options={{
            title: 'Reports',
            tabBarIcon: ({ color }) => (
              <View>
                <Award size={24} color={color} />
              </View>
            ),
          }}
        />
      )}

      {/* Settings Tab - All users */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <View>
              <Settings size={24} color={color} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: colors.error,
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});