import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressManager, QuizManager, DataUtils } from '../utils/DataManager';

const { width } = Dimensions.get('window');

const ProgressTracker = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [quizData, setQuizData] = useState({});
  const [statistics, setStatistics] = useState({});
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    loadProgressData();
  }, []);

  useEffect(() => {
    // Animate progress bars
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [statistics]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const userId = await AsyncStorage.getItem('userId');
      
      if (userId) {
        setUserData({ username: userId });
        
        // Load progress data
        const progress = await ProgressManager.getUserProgress(userId);
        setProgressData(progress);
        
        // Load quiz scores
        const quizScores = await QuizManager.getUserQuizScores(userId);
        setQuizData(quizScores);
        
        // Load statistics
        const stats = await DataUtils.getAppStatistics(userId);
        setStatistics(stats);
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubjectProgress = (subject) => {
    const subjectKeys = Object.keys(progressData).filter(key => 
      key.startsWith(subject)
    );
    
    if (subjectKeys.length === 0) return 0;
    
    const totalProgress = subjectKeys.reduce((sum, key) => {
      return sum + (progressData[key].completionPercentage || 0);
    }, 0);
    
    return Math.round(totalProgress / subjectKeys.length);
  };

  const getSubjectQuizAverage = (subject) => {
    const subjectQuizzes = Object.keys(quizData).filter(key => 
      key.startsWith(subject)
    );
    
    if (subjectQuizzes.length === 0) return 0;
    
    let totalScore = 0;
    let totalQuizzes = 0;
    
    subjectQuizzes.forEach(key => {
      const quizzes = quizData[key];
      quizzes.forEach(quiz => {
        totalScore += quiz.score;
        totalQuizzes++;
      });
    });
    
    return totalQuizzes > 0 ? Math.round((totalScore / totalQuizzes) * 100) : 0;
  };

  const getWeeklyProgress = () => {
    // Generate sample weekly progress data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      progress: Math.floor(Math.random() * 100)
    }));
  };

  const AnimatedProgressBar = ({ progress, color = '#4A7C7E' }) => {
    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                backgroundColor: color,
                width: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', `${progress}%`],
                }),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    );
  };

  const renderOverviewTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Overall Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Progress</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{statistics.overallProgress || 0}%</Text>
            <Text style={styles.statLabel}>Overall Progress</Text>
            <AnimatedProgressBar progress={statistics.overallProgress || 0} />
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{statistics.completedLessons || 0}</Text>
            <Text style={styles.statLabel}>Lessons Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{statistics.totalQuizzes || 0}</Text>
            <Text style={styles.statLabel}>Quizzes Taken</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{statistics.averageScore || 0}%</Text>
            <Text style={styles.statLabel}>Average Score</Text>
            <AnimatedProgressBar progress={statistics.averageScore || 0} color="#27ae60" />
          </View>
        </View>
      </View>

      {/* Subject-wise Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subject Progress</Text>
        {['MATHS', 'SCIENCE', 'ENGLISH', 'HINDI', 'S.S.T'].map(subject => (
          <View key={subject} style={styles.subjectProgressCard}>
            <View style={styles.subjectHeader}>
              <Text style={styles.subjectName}>{subject}</Text>
              <Text style={styles.subjectPercentage}>
                {getSubjectProgress(subject)}% Complete
              </Text>
            </View>
            <AnimatedProgressBar progress={getSubjectProgress(subject)} />
            <View style={styles.subjectStats}>
              <Text style={styles.subjectStat}>
                Quiz Average: {getSubjectQuizAverage(subject)}%
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityContainer}>
          {Object.keys(progressData).slice(-3).map((key, index) => {
            const progress = progressData[key];
            return (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Text style={styles.activityIconText}>📚</Text>
                </View>
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>
                    Progress updated in {key.split('_')[0]}
                  </Text>
                  <Text style={styles.activityTime}>
                    {new Date(progress.updatedAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.activityProgress}>
                  {progress.completionPercentage}%
                </Text>
              </View>
            );
          })}
          {Object.keys(progressData).length === 0 && (
            <Text style={styles.noActivityText}>
              Start learning to see your activity here!
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );

  const renderWeeklyTab = () => {
    const weeklyData = getWeeklyProgress();
    
    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week's Progress</Text>
          <View style={styles.weeklyChart}>
            {weeklyData.map((day, index) => (
              <View key={index} style={styles.weeklyDay}>
                <View style={styles.weeklyBarContainer}>
                  <View
                    style={[
                      styles.weeklyBar,
                      { height: `${day.progress}%` }
                    ]}
                  />
                </View>
                <Text style={styles.weeklyDayLabel}>{day.day}</Text>
                <Text style={styles.weeklyDayValue}>{day.progress}%</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Goals</Text>
          <View style={styles.goalCard}>
            <Text style={styles.goalTitle}>Study 5 lessons this week</Text>
            <AnimatedProgressBar progress={60} color="#3498db" />
            <Text style={styles.goalSubtext}>3 of 5 lessons completed</Text>
          </View>
          <View style={styles.goalCard}>
            <Text style={styles.goalTitle}>Take 3 quizzes this week</Text>
            <AnimatedProgressBar progress={33} color="#e74c3c" />
            <Text style={styles.goalSubtext}>1 of 3 quizzes completed</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderAchievementsTab = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.achievementsGrid}>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <Text style={styles.achievementTitle}>First Quiz</Text>
            <Text style={styles.achievementDesc}>Complete your first quiz</Text>
            <Text style={styles.achievementStatus}>Unlocked</Text>
          </View>
          <View style={[styles.achievementCard, styles.lockedAchievement]}>
            <Text style={styles.achievementIcon}>🎯</Text>
            <Text style={styles.achievementTitle}>Perfect Score</Text>
            <Text style={styles.achievementDesc}>Get 100% on a quiz</Text>
            <Text style={styles.achievementStatus}>Locked</Text>
          </View>
          <View style={[styles.achievementCard, styles.lockedAchievement]}>
            <Text style={styles.achievementIcon}>🔥</Text>
            <Text style={styles.achievementTitle}>Week Warrior</Text>
            <Text style={styles.achievementDesc}>Study for 7 consecutive days</Text>
            <Text style={styles.achievementStatus}>Locked</Text>
          </View>
          <View style={[styles.achievementCard, styles.lockedAchievement]}>
            <Text style={styles.achievementIcon}>📚</Text>
            <Text style={styles.achievementTitle}>Learning Champion</Text>
            <Text style={styles.achievementDesc}>Complete 10 lessons</Text>
            <Text style={styles.achievementStatus}>Locked</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading progress...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4A7C7E" barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Progress Tracker</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'weekly', label: 'Weekly' },
          { key: 'achievements', label: 'Achievements' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              selectedTab === tab.key && styles.activeTab
            ]}
            onPress={() => setSelectedTab(tab.key)}
          >
            <Text style={[
              styles.tabText,
              selectedTab === tab.key && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {selectedTab === 'overview' && renderOverviewTab()}
        {selectedTab === 'weekly' && renderWeeklyTab()}
        {selectedTab === 'achievements' && renderAchievementsTab()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  header: {
    backgroundColor: '#4A7C7E',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    fontFamily: 'serif',
  },
  headerSpacer: {
    width: 40,
  },
  tabContainer: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4A7C7E',
  },
  tabText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4A7C7E',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    fontFamily: 'serif',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A7C7E',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginBottom: 5,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 10,
    color: '#7f8c8d',
  },
  subjectProgressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subjectPercentage: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  subjectStats: {
    marginTop: 10,
  },
  subjectStat: {
    fontSize: 12,
    color: '#5d6d7e',
  },
  activityContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityIconText: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  activityProgress: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A7C7E',
  },
  noActivityText: {
    fontSize: 14,
    color: '#95a5a6',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  weeklyChart: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
  },
  weeklyDay: {
    alignItems: 'center',
    flex: 1,
  },
  weeklyBarContainer: {
    height: 120,
    width: 20,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  weeklyBar: {
    backgroundColor: '#4A7C7E',
    borderRadius: 10,
    width: '100%',
  },
  weeklyDayLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 3,
  },
  weeklyDayValue: {
    fontSize: 10,
    color: '#5d6d7e',
  },
  goalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 3,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  goalSubtext: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 5,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    alignItems: 'center',
  },
  lockedAchievement: {
    opacity: 0.6,
  },
  achievementIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 11,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementStatus: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#27ae60',
    backgroundColor: '#d5f4e6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
});

export default ProgressTracker;