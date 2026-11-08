import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

function WarningTriangle() {
  return (
    <View style={styles.triangleContainer}>
      <View style={styles.triangleRed}>
        <View style={styles.triangleWhite}>
          <View style={styles.triangleHump} />
        </View>
      </View>
    </View>
  );
}

function MockPhonePreview() {
  return (
    <View style={styles.mockupWrapper}>
      {/* Background layered card for depth */}
      <View style={styles.mockupBackdropCard} />

      {/* Main question preview card */}
      <View style={styles.mockupCard}>
        {/* Top question area with warning sign */}
        <View style={styles.mockupHeader}>
          <Text style={styles.mockupQuestionText} numberOfLines={2}>
            Which of these plates normally appears with this road sign?
          </Text>
          <WarningTriangle />
        </View>

        {/* Mini prompt */}
        <Text style={styles.mockupPrompt}>MARK ONE ANSWER</Text>

        {/* 2x2 answer choices */}
        <View style={styles.mockupGrid}>
          <View style={styles.mockupOption}>
            <Text style={styles.mockupOptionKey}>A</Text>
            <View style={styles.mockupOptionBox}>
              <Text style={styles.mockupOptionText}>Hump Bridge</Text>
            </View>
          </View>

          <View style={styles.mockupOption}>
            <Text style={styles.mockupOptionKey}>B</Text>
            <View style={styles.mockupOptionBox}>
              <Text style={styles.mockupOptionText}>Low Bridge</Text>
            </View>
          </View>

          <View style={styles.mockupOption}>
            <Text style={styles.mockupOptionKey}>C</Text>
            <View style={styles.mockupOptionBox}>
              <Text style={styles.mockupOptionText}>Humps for ½ mile</Text>
            </View>
          </View>

          <View style={styles.mockupOption}>
            <Text style={styles.mockupOptionKey}>D</Text>
            <View style={styles.mockupOptionBox}>
              <Text style={styles.mockupOptionText}>Soft Verge</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function CurvedArrow() {
  return (
    <View style={styles.arrowContainer}>
      {/* Curved stroke */}
      <View style={styles.arrowCurve} />
      {/* Arrowhead */}
      <View style={styles.arrowHead} />
    </View>
  );
}

function SmartStudyCard(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Smart Study Test</Text>

      <View style={styles.card}>
        <View style={styles.copy}>
          <Text style={styles.title}>Smart Study Tests</Text>
          <Text style={styles.subtitle}>Practice your weak spots</Text>

          <View style={styles.buttonRow}>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Find out More</Text>
            </Pressable>
            <CurvedArrow />
          </View>
        </View>

        <MockPhonePreview />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#103960',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#EDF6FD',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  copy: {
    flex: 1,
    paddingRight: 6,
    zIndex: 2,
  },
  title: {
    color: '#0E365E',
    fontSize: 21,
    lineHeight: 25,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#2A73A5',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  button: {
    backgroundColor: '#24A0F2',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: '#177FC5',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  arrowContainer: {
    position: 'absolute',
    left: 116,
    bottom: -6,
    width: 60,
    height: 36,
    justifyContent: 'flex-end',
  },
  arrowCurve: {
    position: 'absolute',
    bottom: 12,
    left: 2,
    width: 48,
    height: 18,
    borderBottomWidth: 2.5,
    borderRightWidth: 0,
    borderColor: '#18649C',
    borderRadius: 14,
    transform: [{rotate: '-8deg'}],
  },
  arrowHead: {
    position: 'absolute',
    bottom: 14,
    right: 4,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#18649C',
    transform: [{rotate: '5deg'}],
  },
  mockupWrapper: {
    width: 122,
    height: 168,
    position: 'relative',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  mockupBackdropCard: {
    position: 'absolute',
    left: -6,
    top: 14,
    width: 110,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#D7E9F7',
    opacity: 0.7,
    transform: [{rotate: '-4deg'}],
  },
  mockupCard: {
    width: 118,
    height: 164,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D4E6F4',
    padding: 6,
    shadowColor: '#A8C7DF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  mockupHeader: {
    backgroundColor: '#EDF5FC',
    borderRadius: 8,
    padding: 5,
    alignItems: 'center',
    marginBottom: 5,
  },
  mockupQuestionText: {
    color: '#497395',
    fontSize: 5.5,
    lineHeight: 7.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  triangleContainer: {
    width: 32,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  triangleRed: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 26,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#E1251B',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  triangleWhite: {
    position: 'absolute',
    bottom: -24,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 11,
    borderRightWidth: 11,
    borderBottomWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  triangleHump: {
    position: 'absolute',
    bottom: -15,
    width: 10,
    height: 5,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: '#222222',
  },
  mockupPrompt: {
    color: '#6289A8',
    fontSize: 5,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  mockupGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 3,
  },
  mockupOption: {
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginBottom: 3,
  },
  mockupOptionKey: {
    color: '#264A6A',
    fontSize: 6,
    fontWeight: '700',
  },
  mockupOptionBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 0.8,
    borderColor: '#98BEDB',
    borderRadius: 3,
    paddingVertical: 2.5,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockupOptionText: {
    color: '#153655',
    fontSize: 4.8,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default SmartStudyCard;
