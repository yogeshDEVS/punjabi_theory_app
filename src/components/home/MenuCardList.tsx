import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {MaterialIcons} from '@react-native-vector-icons/material-icons';

import {menuCards} from '../../features/home/data';
import {homePalette} from '../../features/home/theme';

interface MenuCardListProps {
  onCardPress?: (cardId: string) => void;
}

function MenuCardList({onCardPress}: MenuCardListProps): React.JSX.Element {
  return (
    <View style={styles.cardList}>
      {menuCards.map(card => (
        <Pressable
          key={card.id}
          style={({pressed}) => [styles.menuCard, pressed && styles.menuCardPressed]}
          onPress={() => onCardPress?.(card.id)}>
          <View style={[styles.accentBar, {backgroundColor: card.iconTone}]} />
          <View style={[styles.iconPanel, {backgroundColor: card.iconBackground}]}>
            <MaterialIcons name={card.icon} size={34} color={card.iconTone} />
          </View>

          <View style={styles.menuCopy}>
            <Text style={styles.menuTitle}>{card.title}</Text>
            <Text style={styles.menuDescription}>{card.description}</Text>
            <Text style={[styles.actionLabel, {color: card.iconTone}]}>EXPLORE</Text>
          </View>

          <View style={[styles.chevronWrap, {backgroundColor: card.iconBackground}]}>
            <MaterialIcons name="arrow-forward" size={19} color={card.iconTone} />
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardList: {
    marginBottom: 10,
  },
  menuCard: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: homePalette.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5DACA',
    paddingLeft: 16,
    paddingRight: 14,
    paddingVertical: 14,
    marginBottom: 14,
    shadowColor: homePalette.shadow,
    shadowOffset: {width: 0, height: 7},
    shadowOpacity: 0.14,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },
  menuCardPressed: {
    opacity: 0.88,
    transform: [{scale: 0.985}],
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 18,
    bottom: 18,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  iconPanel: {
    width: 68,
    height: 68,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E4E5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuCopy: {
    flex: 1,
    paddingRight: 10,
  },
  menuTitle: {
    color: homePalette.ink,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
    marginBottom: 2,
  },
  menuDescription: {
    color: homePalette.muted,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  actionLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
    marginTop: 8,
  },
  chevronWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MenuCardList;
