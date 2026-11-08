import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

import {homePalette} from '../../features/home/theme';

interface PracticeOptionCardProps {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  accent: string;
  background: string;
  onPress?: () => void;
}

function PracticeOptionCard({
  title,
  subtitle,
  description,
  icon,
  accent,
  background,
  onPress,
}: PracticeOptionCardProps): React.JSX.Element {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={[styles.iconShell, {backgroundColor: background}]}>
        <MaterialIcons name={icon} size={46} color={accent} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.subtitle, {color: accent}]}>{subtitle}</Text>
      <Text style={styles.description}>{description}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: homePalette.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E3D8CB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: homePalette.shadow,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  iconShell: {
    width: 76,
    height: 76,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    color: homePalette.ink,
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '900',
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  description: {
    color: homePalette.muted,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    paddingHorizontal: 2,
  },
});

export default PracticeOptionCard;
