import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

interface PracticeTopicCardProps {
  title: string;
  subtitle: string;
  icon: string;
  locked: boolean;
  progress: number;
  iconColor?: string;
  onPress?: () => void;
}

function CrossroadIcon({locked}: {locked: boolean}) {
  const color = locked ? '#A6BACB' : '#3E7CA9';
  return (
    <View style={styles.crossContainer}>
      {/* Outer cross bars */}
      <View style={[styles.crossBarVertical, {borderColor: color}]} />
      <View style={[styles.crossBarHorizontal, {borderColor: color}]} />
      <View style={[styles.crossCenterDash, {backgroundColor: color}]} />
    </View>
  );
}

function StopSignIcon({locked}: {locked: boolean}) {
  const color = locked ? '#ADC1D2' : '#E05345';
  return (
    <View style={[styles.stopSignOuter, {borderColor: color}]}>
      <Text style={[styles.stopSignText, {color}]}>STOP</Text>
    </View>
  );
}

function PracticeTopicCard({
  title,
  subtitle,
  icon,
  locked,
  progress,
  iconColor,
  onPress,
}: PracticeTopicCardProps): React.JSX.Element {
  return (
    <Pressable
      disabled={locked}
      onPress={onPress}
      style={({pressed}) => [
        styles.card,
        locked ? styles.cardLocked : styles.cardActive,
        pressed && !locked && styles.cardPressed,
      ]}>
      <View style={styles.iconShell}>
        {icon === 'crossroad' ? (
          <CrossroadIcon locked={locked} />
        ) : icon === 'stop-sign' ? (
          <StopSignIcon locked={locked} />
        ) : (
          <MaterialIcons
            name={icon}
            size={28}
            color={locked ? '#ADC1D2' : iconColor ?? '#3E7CA9'}
          />
        )}
      </View>

      <View style={styles.copy}>
        <Text
          numberOfLines={1}
          style={[styles.title, locked && styles.titleLocked]}>
          {title}
        </Text>
        <Text style={[styles.subtitle, locked && styles.subtitleLocked]}>
          {subtitle}
        </Text>
      </View>

      {locked ? (
        <View style={styles.lockBadge}>
          <MaterialIcons name="lock" size={20} color="#FFFFFF" />
        </View>
      ) : (
        <View style={styles.progressRing}>
          <Text style={styles.progressText}>{progress}%</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FBFE',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8F1F8',
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#B4CCE0',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 1,
  },
  cardActive: {
    backgroundColor: '#FFFFFF',
  },
  cardLocked: {
    backgroundColor: '#FAFCFE',
    opacity: 0.85,
  },
  cardPressed: {
    opacity: 0.85,
    backgroundColor: '#F0F7FD',
  },
  iconShell: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  crossContainer: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  crossBarVertical: {
    position: 'absolute',
    width: 12,
    height: 32,
    borderWidth: 2,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  crossBarHorizontal: {
    position: 'absolute',
    width: 32,
    height: 12,
    borderWidth: 2,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
  crossCenterDash: {
    width: 4,
    height: 4,
    borderRadius: 1,
  },
  stopSignOuter: {
    width: 34,
    height: 34,
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopSignText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  copy: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    color: '#1A436B',
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 3,
  },
  titleLocked: {
    color: '#9BB0C1',
  },
  subtitle: {
    color: '#7D9DB6',
    fontSize: 13,
    fontWeight: '500',
  },
  subtitleLocked: {
    color: '#B2C5D4',
  },
  progressRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#D2E6F5',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  progressText: {
    color: '#7D9DB6',
    fontSize: 11,
    fontWeight: '700',
  },
  lockBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#AFC3D3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PracticeTopicCard;
