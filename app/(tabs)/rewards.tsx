import { BadgeItem } from '@/components/BadgeItem';
import { LeaderboardItem } from '@/components/LeaderboardItem';
import { Card } from '@/components/ui/Card';
import { colors } from '@/constants/colors';
import { useAuthStore } from '@/hooks/useAuthStore';
import { mockUsers } from '@/mocks/users';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RewardsScreen() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'badges' | 'leaderboard' | 'certificates'>('badges');
  
  // Get user badges
  const userBadges = user?.badges || [];
  
  // Sort users by XP for leaderboard
  const leaderboardUsers = [...mockUsers]
    .filter(u => u.role === 'volunteer' && u.xp !== undefined)
    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
    .slice(0, 10);
  
  // Render badges tab
  const renderBadgesTab = () => {
    return (
      <View style={styles.badgesContainer}>
        <Text style={styles.sectionTitle}>Your Badges</Text>
        <Text style={styles.sectionSubtitle}>
          Earn badges by participating in cleanup events and properly segregating waste
        </Text>
        
        <View style={styles.badgesGrid}>
          {userBadges.map(badge => (
            <View key={badge.id} style={styles.badgeItem}>
              <BadgeItem badge={badge} />
            </View>
          ))}
          
          {/* Add some locked badges for demo */}
          <View style={styles.badgeItem}>
            <BadgeItem 
              badge={{
                id: 'b4',
                name: 'Cleanup Champion',
                description: 'Participated in 10 cleanup events',
                icon: '🏆',
                unlocked: false,
              }} 
            />
          </View>
          
          <View style={styles.badgeItem}>
            <BadgeItem 
              badge={{
                id: 'b5',
                name: 'Waste Wizard',
                description: 'Classified 20 waste bags correctly',
                icon: '🧙‍♂️',
                unlocked: false,
              }} 
            />
          </View>
          
          <View style={styles.badgeItem}>
            <BadgeItem 
              badge={{
                id: 'b6',
                name: 'Beach Guardian',
                description: 'Participated in 5 beach cleanup events',
                icon: '🏖️',
                unlocked: false,
              }} 
            />
          </View>
        </View>
      </View>
    );
  };
  
  // Render leaderboard tab
  const renderLeaderboardTab = () => {
    return (
      <View style={styles.leaderboardContainer}>
        <Text style={styles.sectionTitle}>Leaderboard</Text>
        <Text style={styles.sectionSubtitle}>
          Top volunteers ranked by XP earned from cleanup activities
        </Text>
        
        <Card style={styles.leaderboardCard}>
          {leaderboardUsers.map((leaderboardUser, index) => (
            <LeaderboardItem 
              key={leaderboardUser.id}
              rank={index + 1}
              name={leaderboardUser.name}
              score={leaderboardUser.xp || 0}
              avatar={leaderboardUser.avatar}
              isCurrentUser={leaderboardUser.id === user?.id}
            />
          ))}
        </Card>
      </View>
    );
  };
  
  // Render certificates tab
  const renderCertificatesTab = () => {
    return (
      <View style={styles.certificatesContainer}>
        <Text style={styles.sectionTitle}>My Certificates</Text>
        <Text style={styles.sectionSubtitle}>
          Download and share certificates for events you've participated in
        </Text>
        
        {user?.eventsJoined && user.eventsJoined.length > 0 ? (
          <Card style={styles.certificatesCard}>
            <View style={styles.certificateItem}>
              <View style={styles.certificateIcon}>
                <Text style={styles.certificateIconText}>🏆</Text>
              </View>
              <View style={styles.certificateInfo}>
                <Text style={styles.certificateName}>Juhu Beach Cleanup Drive</Text>
                <Text style={styles.certificateDate}>July 10, 2025</Text>
              </View>
              <TouchableOpacity style={styles.certificateDownload}>
                <Text style={styles.certificateDownloadText}>Download</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.certificateItem}>
              <View style={styles.certificateIcon}>
                <Text style={styles.certificateIconText}>🏆</Text>
              </View>
              <View style={styles.certificateInfo}>
                <Text style={styles.certificateName}>IIT Campus Cleanup</Text>
                <Text style={styles.certificateDate}>July 5, 2025</Text>
              </View>
              <TouchableOpacity style={styles.certificateDownload}>
                <Text style={styles.certificateDownloadText}>Download</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ) : (
          <Card style={styles.emptyCertificatesCard}>
            <Text style={styles.emptyCertificatesText}>
              You haven't earned any certificates yet. Participate in cleanup events to earn certificates.
            </Text>
          </Card>
        )}
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'badges' && styles.activeTab]}
          onPress={() => setActiveTab('badges')}
        >
          <Text style={[styles.tabText, activeTab === 'badges' && styles.activeTabText]}>
            Badges
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
          onPress={() => setActiveTab('leaderboard')}
        >
          <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>
            Leaderboard
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'certificates' && styles.activeTab]}
          onPress={() => setActiveTab('certificates')}
        >
          <Text style={[styles.tabText, activeTab === 'certificates' && styles.activeTabText]}>
            Certificates
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {activeTab === 'badges' && renderBadgesTab()}
        {activeTab === 'leaderboard' && renderLeaderboardTab()}
        {activeTab === 'certificates' && renderCertificatesTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
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
    marginBottom: 24,
  },
  badgesContainer: {},
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '48%',
    marginBottom: 16,
  },
  leaderboardContainer: {},
  leaderboardCard: {
    padding: 0,
    overflow: 'hidden',
  },
  certificatesContainer: {},
  certificatesCard: {
    padding: 0,
    overflow: 'hidden',
  },
  certificateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  certificateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(34, 139, 34, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  certificateIconText: {
    fontSize: 20,
  },
  certificateInfo: {
    flex: 1,
  },
  certificateName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textDark,
    marginBottom: 4,
  },
  certificateDate: {
    fontSize: 14,
    color: colors.textLight,
  },
  certificateDownload: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  certificateDownloadText: {
    fontSize: 14,
    color: colors.card,
    fontWeight: '500',
  },
  emptyCertificatesCard: {
    padding: 24,
    alignItems: 'center',
  },
  emptyCertificatesText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});