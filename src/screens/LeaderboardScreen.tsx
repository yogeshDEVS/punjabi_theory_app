import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

import type {AuthUser, LeaderboardEntry} from '../services/firebaseAuth';
import {fetchMockExamLeaderboard} from '../services/firebaseAuth';
import {mockExamQuestions} from '../features/theory/mockExamData';

interface LeaderboardScreenProps {
  user: AuthUser | null;
  onBack: () => void;
}

export default function LeaderboardScreen({user, onBack}: LeaderboardScreenProps): React.JSX.Element {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const loadLeaderboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(false);
    try {
      setEntries(await fetchMockExamLeaderboard());
    } catch (loadError) {
      console.warn('Could not load leaderboard', loadError);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { void loadLeaderboard(); }, [loadLeaderboard]);

  const currentUserRank = useMemo(
    () => user ? entries.findIndex(entry => entry.uid === user.uid) + 1 : 0,
    [entries, user],
  );
  const visibleEntries = entries.slice(0, 10);
  const currentUserName = user?.displayName || user?.email?.split('@')[0] || 'You';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Back to home" onPress={onBack} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={22} color="#17344E" />
        </Pressable>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Refresh leaderboard" onPress={() => void loadLeaderboard(true)} style={styles.backButton}>
          <MaterialIcons name="refresh" size={22} color="#17344E" />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void loadLeaderboard(true)} tintColor="#16735B" />}>
        <View style={styles.hero}>
          <View style={styles.heroIcon}><MaterialIcons name="emoji-events" size={28} color="#D8952B" /></View>
          <Text style={styles.title}>Mock test toppers</Text>
          <Text style={styles.subtitle}>Ranked by each learner’s highest score out of {mockExamQuestions.length}.</Text>
        </View>

        {!user ? (
          <View style={styles.messageCard}>
            <MaterialIcons name="lock-outline" size={22} color="#A96B27" />
            <View style={styles.messageCopy}>
              <Text style={styles.messageTitle}>Sign in to see your ranking</Text>
              <Text style={styles.messageText}>Leaderboard scores are linked to authenticated learner accounts. Guest results are not ranked.</Text>
            </View>
          </View>
        ) : (
          <View style={styles.yourRankCard}>
            <View style={styles.rankBadge}><Text style={styles.rankBadgeText}>{currentUserRank ? `#${currentUserRank}` : '—'}</Text></View>
            <View style={styles.rankCopy}>
              <Text style={styles.rankEyebrow}>YOUR RANK</Text>
              <Text style={styles.rankName} numberOfLines={1}>{currentUserName}</Text>
              <Text style={styles.rankHint}>{currentUserRank ? 'Your best mock test score' : 'Complete a mock test to join the rankings'}</Text>
            </View>
            <MaterialIcons name="person" size={23} color="#16735B" />
          </View>
        )}

        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Top learners</Text>
          <Text style={styles.listCaption}>{entries.length} ranked</Text>
        </View>

        {loading ? (
          <View style={styles.stateCard}><ActivityIndicator size="large" color="#16735B" /><Text style={styles.stateText}>Loading rankings…</Text></View>
        ) : error ? (
          <View style={styles.stateCard}>
            <MaterialIcons name="cloud-off" size={27} color="#A96B27" />
            <Text style={styles.stateText}>Could not load rankings. Check your connection and try again.</Text>
            <Pressable onPress={() => void loadLeaderboard()} style={styles.retryButton}><Text style={styles.retryText}>Try again</Text></Pressable>
          </View>
        ) : entries.length === 0 ? (
          <View style={styles.stateCard}>
            <MaterialIcons name="school" size={27} color="#608095" />
            <Text style={styles.stateTitle}>No scores yet</Text>
            <Text style={styles.stateText}>Be the first to complete a signed in mock test.</Text>
          </View>
        ) : (
          <View style={styles.listCard}>
            {visibleEntries.map((entry, index) => {
              const isCurrentUser = entry.uid === user?.uid;
              return (
                <View key={entry.uid} style={[styles.row, index === 0 && styles.firstRow, index === visibleEntries.length - 1 && styles.lastRow, isCurrentUser && styles.currentRow]}>
                  <View style={[styles.position, index < 3 && styles.medalPosition]}>
                    {index < 3 ? <MaterialIcons name="emoji-events" size={17} color={index === 0 ? '#D8952B' : '#8093A0'} /> : <Text style={styles.positionText}>{index + 1}</Text>}
                  </View>
                  <View style={styles.learnerCopy}>
                    <Text style={styles.learnerName} numberOfLines={1}>{isCurrentUser ? `${entry.displayName} (You)` : entry.displayName}</Text>
                    <Text style={styles.learnerCaption}>{entry.updatedAt ? `Updated ${new Date(entry.updatedAt).toLocaleDateString()}` : 'Mock test score'}</Text>
                  </View>
                  <Text style={styles.score}>{entry.bestScore}<Text style={styles.scoreTotal}>/{mockExamQuestions.length}</Text></Text>
                </View>
              );
            })}
          </View>
        )}

        {currentUserRank > 10 ? (
          <Text style={styles.outsideTop}>Your position is #{currentUserRank}. Keep practising to reach the top 10.</Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: '#F5F7FA', paddingHorizontal: 8, paddingTop: 24},
  header: {height: 58, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  backButton: {width: 40, height: 40, borderRadius: 13, backgroundColor: '#E8EEF3', alignItems: 'center', justifyContent: 'center'},
  headerTitle: {color: '#17344E', fontSize: 19, fontWeight: '900'},
  content: {paddingHorizontal: 14, paddingTop: 18, paddingBottom: 34},
  hero: {alignItems: 'center', paddingVertical: 23, paddingHorizontal: 18},
  heroIcon: {width: 58, height: 58, borderRadius: 20, backgroundColor: '#FFF2D8', alignItems: 'center', justifyContent: 'center'},
  title: {color: '#17344E', fontSize: 25, fontWeight: '900', marginTop: 13},
  subtitle: {color: '#6D7F8C', fontSize: 14, lineHeight: 20, textAlign: 'center', marginTop: 6},
  messageCard: {flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 16, borderRadius: 17, backgroundColor: '#FFF8E9', borderWidth: 1, borderColor: '#F0DDB7'},
  messageCopy: {flex: 1},
  messageTitle: {color: '#6E4A1F', fontSize: 15, fontWeight: '800'},
  messageText: {color: '#806A4F', fontSize: 13, lineHeight: 19, marginTop: 4},
  yourRankCard: {flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 18, backgroundColor: '#E9F6F1', borderWidth: 1, borderColor: '#CBE8DC'},
  rankBadge: {width: 50, height: 50, borderRadius: 16, backgroundColor: '#D1EEE2', alignItems: 'center', justifyContent: 'center'},
  rankBadgeText: {color: '#16735B', fontSize: 16, fontWeight: '900'},
  rankCopy: {flex: 1, marginHorizontal: 12},
  rankEyebrow: {color: '#43806A', fontSize: 10, fontWeight: '900', letterSpacing: 1},
  rankName: {color: '#17344E', fontSize: 16, fontWeight: '900', marginTop: 2},
  rankHint: {color: '#638173', fontSize: 12, marginTop: 3},
  listHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, marginBottom: 11},
  listTitle: {color: '#17344E', fontSize: 17, fontWeight: '900'},
  listCaption: {color: '#758796', fontSize: 12, fontWeight: '700'},
  listCard: {backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 14, borderWidth: 1, borderColor: '#E1E8EE'},
  row: {minHeight: 70, flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#EEF1F4'},
  firstRow: {minHeight: 78},
  lastRow: {borderBottomWidth: 0},
  currentRow: {backgroundColor: '#F0FAF6', marginHorizontal: -14, paddingHorizontal: 14},
  position: {width: 34, height: 34, borderRadius: 12, backgroundColor: '#F0F3F6', alignItems: 'center', justifyContent: 'center', marginRight: 11},
  medalPosition: {backgroundColor: '#FFF5DF'},
  positionText: {color: '#667B8B', fontSize: 13, fontWeight: '900'},
  learnerCopy: {flex: 1},
  learnerName: {color: '#203C52', fontSize: 14, fontWeight: '800'},
  learnerCaption: {color: '#84929D', fontSize: 11, marginTop: 4},
  score: {color: '#16735B', fontSize: 17, fontWeight: '900'},
  scoreTotal: {color: '#8A9AA5', fontSize: 12, fontWeight: '700'},
  stateCard: {minHeight: 145, padding: 22, borderRadius: 18, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E1E8EE'},
  stateTitle: {color: '#203C52', fontSize: 16, fontWeight: '900', marginTop: 10},
  stateText: {color: '#718492', fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 9},
  retryButton: {marginTop: 14, paddingHorizontal: 18, paddingVertical: 9, borderRadius: 12, backgroundColor: '#16735B'},
  retryText: {color: '#FFFFFF', fontSize: 13, fontWeight: '800'},
  outsideTop: {color: '#638173', fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 13},
});
