import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Animated,
  Vibration
} from 'react-native';

const { width } = Dimensions.get('window');

const SubjectSelection = ({ route, navigation }) => {
  const selectedClass = route?.params?.selectedClass || 6;

  // Animation refs
  const backScale = useRef(new Animated.Value(1)).current;
  const cardScales = useRef(
    Array(10).fill().map(() => new Animated.Value(1))
  ).current;

  const getSubjectsForClass = (classNumber) => {
    if (classNumber >= 6 && classNumber <= 8) {
      return ['MATHS', 'SCIENCE', 'S.S.T', 'HINDI', 'ENGLISH'];
    } else if (classNumber >= 9 && classNumber <= 10) {
      return [
        'MATHS', 'HINDI', 'ENGLISH', 'BIOLOGY', 'CHEMISTRY', 'PHYSICS',
        'HISTORY', 'GEOGRAPHY', 'CIVICS', 'ECONOMICS'
      ];
    }
    return [];
  };

  const subjects = getSubjectsForClass(selectedClass);

  const handleBackPressIn = () => {
    Animated.spring(backScale, { toValue: 0.92, useNativeDriver: true }).start();
    Vibration.vibrate(30);
  };
  const handleBackPressOut = () => {
    Animated.spring(backScale, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleCardPressIn = (idx) => {
    Animated.spring(cardScales[idx], { toValue: 0.96, useNativeDriver: true }).start();
    Vibration.vibrate(13);
  };
  const handleCardPressOut = (idx) => {
    Animated.spring(cardScales[idx], { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.bg}>
      <SafeAreaView style={styles.main}>
        {/* Interactive Back Button */}
        <View style={styles.header}>
          <Animated.View style={{ transform: [{ scale: backScale }] }}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
              onPressIn={handleBackPressIn}
              onPressOut={handleBackPressOut}
              activeOpacity={0.7}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Select a Subject</Text>

        {/* Subjects Grid */}
        <View style={styles.grid}>
          {subjects.map((subj, idx) => (
            <Animated.View
              key={subj}
              style={[
                styles.card,
                { transform: [{ scale: cardScales[idx] }] }
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                style={styles.cardInner}
                onPress={() => {
                  navigation.navigate('SubjectContent', { subject: subj, selectedClass });
                }}
                onPressIn={() => handleCardPressIn(idx)}
                onPressOut={() => handleCardPressOut(idx)}
              >
                <Text style={styles.subject}>{subj}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#e8f5e8', // Light green background
  },
  main: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 18,
    marginLeft: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 22,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#276fbf',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
  },
  backArrow: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    letterSpacing: 2,
  },
  title: {
    fontFamily: 'serif',
    marginTop: 70,
    marginBottom: 28,
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textAlign: 'center',
    color: '#000000ff',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 16,
    elevation: 3,
  },
  grid: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  card: {
    marginBottom: 25,
    width: width * 0.7,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.97)',
    elevation: 7,
    shadowColor: '#276fbf',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  cardInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
  },
  subject: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#000000ff',
    textTransform: 'uppercase',
    textShadowColor: '#b9dafe',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 2,
    
  },
});

export default SubjectSelection;
