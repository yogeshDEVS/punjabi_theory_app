import React from 'react';
import {
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

import type {AuthUser} from '../services/firebaseAuth';

interface ProfileScreenProps {
  user: AuthUser | null;
  onBack: () => void;
}

export default function ProfileScreen({
  user,
  onBack,
}: ProfileScreenProps): React.JSX.Element {
  const email = user?.email ?? 'Guest account';
  const initials = (user?.displayName || email)
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={styles.safeArea.backgroundColor} />
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to home" onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={22} color="#17344E" />
        </Pressable>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials || 'PT'}</Text>
        </View>
        <Text style={styles.name}>{user?.displayName || 'Punjabi Theory learner'}</Text>
        <Text style={styles.subtitle}>Your learning account</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <MaterialIcons name="email" size={20} color="#16735B" />
          </View>
          <View style={styles.infoCopy}>
            <Text style={styles.infoLabel}>EMAIL ADDRESS</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <MaterialIcons name="school" size={20} color="#16735B" />
          <Text style={styles.noteText}>
            Your practice progress is saved as you prepare for your theory test.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    height: 58,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E4E7EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#172B3A',
    fontSize: 18,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 54,
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#DCEFE9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  avatarText: {
    color: '#16735B',
    fontSize: 28,
    fontWeight: '800',
  },
  name: {
    color: '#172B3A',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#667085',
    fontSize: 14,
    marginTop: 6,
    marginBottom: 30,
  },
  infoCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E4E7EC',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: '#EAF5F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  infoCopy: {
    flex: 1,
  },
  infoLabel: {
    color: '#667085',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 5,
  },
  infoValue: {
    color: '#172B3A',
    fontSize: 15,
    fontWeight: '600',
  },
  noteCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EAF5F1',
    borderRadius: 16,
    padding: 16,
    marginTop: 14,
  },
  noteText: {
    flex: 1,
    color: '#34594F',
    fontSize: 13,
    lineHeight: 19,
    marginLeft: 12,
  },
});
