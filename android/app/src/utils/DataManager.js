import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  USER_PROGRESS: 'user_progress',
  QUIZ_SCORES: 'quiz_scores',
  STUDY_NOTES: 'study_notes',
  STUDY_PLAN: 'study_plan',
  ACHIEVEMENTS: 'achievements',
  SETTINGS: 'app_settings',
  OFFLINE_CONTENT: 'offline_content',
};

// User Profile Management
export const UserProfileManager = {
  // Save user profile
  saveProfile: async (profileData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profileData));
      return { success: true };
    } catch (error) {
      console.error('Error saving profile:', error);
      return { success: false, error };
    }
  },

  // Get user profile
  getProfile: async () => {
    try {
      const profileData = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      return profileData ? JSON.parse(profileData) : null;
    } catch (error) {
      console.error('Error getting profile:', error);
      return null;
    }
  },

  // Update profile field
  updateProfile: async (updates) => {
    try {
      const currentProfile = await UserProfileManager.getProfile();
      const updatedProfile = { ...currentProfile, ...updates };
      return await UserProfileManager.saveProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error };
    }
  },
};

// Progress Tracking System
export const ProgressManager = {
  // Save lesson progress
  saveLessonProgress: async (userId, subject, classNumber, lessonId, progress) => {
    try {
      const key = `${STORAGE_KEYS.USER_PROGRESS}_${userId}`;
      const currentProgress = await ProgressManager.getUserProgress(userId);
      
      const updatedProgress = {
        ...currentProgress,
        [`${subject}_${classNumber}_${lessonId}`]: {
          ...progress,
          updatedAt: new Date().toISOString(),
        }
      };

      await AsyncStorage.setItem(key, JSON.stringify(updatedProgress));
      return { success: true };
    } catch (error) {
      console.error('Error saving lesson progress:', error);
      return { success: false, error };
    }
  },

  // Get user progress
  getUserProgress: async (userId) => {
    try {
      const key = `${STORAGE_KEYS.USER_PROGRESS}_${userId}`;
      const progressData = await AsyncStorage.getItem(key);
      return progressData ? JSON.parse(progressData) : {};
    } catch (error) {
      console.error('Error getting user progress:', error);
      return {};
    }
  },

  // Get subject progress
  getSubjectProgress: async (userId, subject, classNumber) => {
    try {
      const allProgress = await ProgressManager.getUserProgress(userId);
      const subjectProgress = {};
      
      Object.keys(allProgress).forEach(key => {
        if (key.startsWith(`${subject}_${classNumber}_`)) {
          const lessonId = key.split('_').pop();
          subjectProgress[lessonId] = allProgress[key];
        }
      });

      return subjectProgress;
    } catch (error) {
      console.error('Error getting subject progress:', error);
      return {};
    }
  },

  // Calculate overall progress percentage
  calculateOverallProgress: async (userId) => {
    try {
      const progress = await ProgressManager.getUserProgress(userId);
      const progressValues = Object.values(progress);
      
      if (progressValues.length === 0) return 0;
      
      const totalProgress = progressValues.reduce((sum, item) => {
        return sum + (item.completionPercentage || 0);
      }, 0);
      
      return Math.round(totalProgress / progressValues.length);
    } catch (error) {
      console.error('Error calculating overall progress:', error);
      return 0;
    }
  },
};

// Quiz Score Management
export const QuizManager = {
  // Save quiz score
  saveQuizScore: async (userId, subject, classNumber, lessonId, quizData) => {
    try {
      const key = `${STORAGE_KEYS.QUIZ_SCORES}_${userId}`;
      const currentScores = await QuizManager.getUserQuizScores(userId);
      
      const quizKey = `${subject}_${classNumber}_${lessonId}`;
      if (!currentScores[quizKey]) {
        currentScores[quizKey] = [];
      }
      
      currentScores[quizKey].push({
        ...quizData,
        timestamp: new Date().toISOString(),
      });

      await AsyncStorage.setItem(key, JSON.stringify(currentScores));
      return { success: true };
    } catch (error) {
      console.error('Error saving quiz score:', error);
      return { success: false, error };
    }
  },

  // Get user quiz scores
  getUserQuizScores: async (userId) => {
    try {
      const key = `${STORAGE_KEYS.QUIZ_SCORES}_${userId}`;
      const scoresData = await AsyncStorage.getItem(key);
      return scoresData ? JSON.parse(scoresData) : {};
    } catch (error) {
      console.error('Error getting quiz scores:', error);
      return {};
    }
  },

  // Get best quiz score for a lesson
  getBestScore: async (userId, subject, classNumber, lessonId) => {
    try {
      const allScores = await QuizManager.getUserQuizScores(userId);
      const quizKey = `${subject}_${classNumber}_${lessonId}`;
      const lessonScores = allScores[quizKey] || [];
      
      if (lessonScores.length === 0) return null;
      
      return lessonScores.reduce((best, current) => {
        return current.score > best.score ? current : best;
      });
    } catch (error) {
      console.error('Error getting best score:', error);
      return null;
    }
  },
};

// Study Notes Management
export const NotesManager = {
  // Save notes for a lesson
  saveNotes: async (userId, subject, classNumber, lessonId, notes) => {
    try {
      const key = `${STORAGE_KEYS.STUDY_NOTES}_${userId}`;
      const currentNotes = await NotesManager.getUserNotes(userId);
      
      const noteKey = `${subject}_${classNumber}_${lessonId}`;
      currentNotes[noteKey] = {
        content: notes,
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(key, JSON.stringify(currentNotes));
      return { success: true };
    } catch (error) {
      console.error('Error saving notes:', error);
      return { success: false, error };
    }
  },

  // Get user notes
  getUserNotes: async (userId) => {
    try {
      const key = `${STORAGE_KEYS.STUDY_NOTES}_${userId}`;
      const notesData = await AsyncStorage.getItem(key);
      return notesData ? JSON.parse(notesData) : {};
    } catch (error) {
      console.error('Error getting notes:', error);
      return {};
    }
  },

  // Get notes for specific lesson
  getLessonNotes: async (userId, subject, classNumber, lessonId) => {
    try {
      const allNotes = await NotesManager.getUserNotes(userId);
      const noteKey = `${subject}_${classNumber}_${lessonId}`;
      return allNotes[noteKey]?.content || '';
    } catch (error) {
      console.error('Error getting lesson notes:', error);
      return '';
    }
  },
};

// Study Plan Management
export const StudyPlanManager = {
  // Create/Update study plan
  saveStudyPlan: async (userId, planData) => {
    try {
      const key = `${STORAGE_KEYS.STUDY_PLAN}_${userId}`;
      const studyPlan = {
        ...planData,
        createdAt: planData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(key, JSON.stringify(studyPlan));
      return { success: true };
    } catch (error) {
      console.error('Error saving study plan:', error);
      return { success: false, error };
    }
  },

  // Get study plan
  getStudyPlan: async (userId) => {
    try {
      const key = `${STORAGE_KEYS.STUDY_PLAN}_${userId}`;
      const planData = await AsyncStorage.getItem(key);
      return planData ? JSON.parse(planData) : null;
    } catch (error) {
      console.error('Error getting study plan:', error);
      return null;
    }
  },

  // Update daily progress
  updateDailyProgress: async (userId, date, subjects) => {
    try {
      const currentPlan = await StudyPlanManager.getStudyPlan(userId);
      if (!currentPlan) return { success: false, error: 'No study plan found' };

      if (!currentPlan.dailyProgress) {
        currentPlan.dailyProgress = {};
      }

      currentPlan.dailyProgress[date] = subjects;
      return await StudyPlanManager.saveStudyPlan(userId, currentPlan);
    } catch (error) {
      console.error('Error updating daily progress:', error);
      return { success: false, error };
    }
  },
};

// Settings Management
export const SettingsManager = {
  // Save app settings
  saveSettings: async (settings) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return { success: true };
    } catch (error) {
      console.error('Error saving settings:', error);
      return { success: false, error };
    }
  },

  // Get app settings
  getSettings: async () => {
    try {
      const settingsData = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settingsData ? JSON.parse(settingsData) : {
        notifications: true,
        darkMode: false,
        autoSync: true,
        language: 'english',
        fontSize: 'medium',
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        notifications: true,
        darkMode: false,
        autoSync: true,
        language: 'english',
        fontSize: 'medium',
      };
    }
  },

  // Update specific setting
  updateSetting: async (key, value) => {
    try {
      const currentSettings = await SettingsManager.getSettings();
      currentSettings[key] = value;
      return await SettingsManager.saveSettings(currentSettings);
    } catch (error) {
      console.error('Error updating setting:', error);
      return { success: false, error };
    }
  },
};

// Achievements System
export const AchievementsManager = {
  // Save achievement
  unlockAchievement: async (userId, achievementId, achievementData) => {
    try {
      const key = `${STORAGE_KEYS.ACHIEVEMENTS}_${userId}`;
      const currentAchievements = await AchievementsManager.getUserAchievements(userId);
      
      currentAchievements[achievementId] = {
        ...achievementData,
        unlockedAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem(key, JSON.stringify(currentAchievements));
      return { success: true };
    } catch (error) {
      console.error('Error unlocking achievement:', error);
      return { success: false, error };
    }
  },

  // Get user achievements
  getUserAchievements: async (userId) => {
    try {
      const key = `${STORAGE_KEYS.ACHIEVEMENTS}_${userId}`;
      const achievementsData = await AsyncStorage.getItem(key);
      return achievementsData ? JSON.parse(achievementsData) : {};
    } catch (error) {
      console.error('Error getting achievements:', error);
      return {};
    }
  },

  // Check for new achievements
  checkAchievements: async (userId, action, data) => {
    try {
      // Define achievement criteria
      const achievements = {
        'first_quiz': {
          title: 'Quiz Master',
          description: 'Complete your first quiz',
          icon: '🎯',
          condition: (action, data) => action === 'quiz_completed',
        },
        'perfect_score': {
          title: 'Perfect Score',
          description: 'Get 100% on a quiz',
          icon: '🏆',
          condition: (action, data) => action === 'quiz_completed' && data.percentage === 100,
        },
        'study_streak_7': {
          title: 'Week Warrior',
          description: 'Study for 7 consecutive days',
          icon: '🔥',
          condition: (action, data) => action === 'daily_study' && data.streakDays >= 7,
        },
        'lesson_completed_10': {
          title: 'Learning Champion',
          description: 'Complete 10 lessons',
          icon: '📚',
          condition: (action, data) => action === 'lesson_completed' && data.totalLessons >= 10,
        },
      };

      const userAchievements = await AchievementsManager.getUserAchievements(userId);
      const newAchievements = [];

      Object.keys(achievements).forEach(achievementId => {
        if (!userAchievements[achievementId]) {
          const achievement = achievements[achievementId];
          if (achievement.condition(action, data)) {
            AchievementsManager.unlockAchievement(userId, achievementId, achievement);
            newAchievements.push({ id: achievementId, ...achievement });
          }
        }
      });

      return newAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  },
};

// Data Utility Functions
export const DataUtils = {
  // Clear all user data
  clearAllUserData: async (userId) => {
    try {
      const keys = [
        `${STORAGE_KEYS.USER_PROGRESS}_${userId}`,
        `${STORAGE_KEYS.QUIZ_SCORES}_${userId}`,
        `${STORAGE_KEYS.STUDY_NOTES}_${userId}`,
        `${STORAGE_KEYS.STUDY_PLAN}_${userId}`,
        `${STORAGE_KEYS.ACHIEVEMENTS}_${userId}`,
      ];
      
      await AsyncStorage.multiRemove(keys);
      return { success: true };
    } catch (error) {
      console.error('Error clearing user data:', error);
      return { success: false, error };
    }
  },

  // Export user data
  exportUserData: async (userId) => {
    try {
      const userData = {
        profile: await UserProfileManager.getProfile(),
        progress: await ProgressManager.getUserProgress(userId),
        quizScores: await QuizManager.getUserQuizScores(userId),
        notes: await NotesManager.getUserNotes(userId),
        studyPlan: await StudyPlanManager.getStudyPlan(userId),
        achievements: await AchievementsManager.getUserAchievements(userId),
        settings: await SettingsManager.getSettings(),
        exportedAt: new Date().toISOString(),
      };

      return { success: true, data: userData };
    } catch (error) {
      console.error('Error exporting user data:', error);
      return { success: false, error };
    }
  },

  // Get app statistics
  getAppStatistics: async (userId) => {
    try {
      const progress = await ProgressManager.getUserProgress(userId);
      const quizScores = await QuizManager.getUserQuizScores(userId);
      const achievements = await AchievementsManager.getUserAchievements(userId);

      const totalLessons = Object.keys(progress).length;
      const completedLessons = Object.values(progress).filter(
        p => p.completionPercentage === 100
      ).length;
      
      const totalQuizzes = Object.values(quizScores).reduce(
        (total, lessonQuizzes) => total + lessonQuizzes.length, 0
      );
      
      const averageScore = totalQuizzes > 0 ? 
        Object.values(quizScores).reduce((sum, lessonQuizzes) => {
          const lessonSum = lessonQuizzes.reduce((ls, quiz) => ls + quiz.score, 0);
          return sum + lessonSum;
        }, 0) / totalQuizzes : 0;

      return {
        totalLessons,
        completedLessons,
        totalQuizzes,
        averageScore: Math.round(averageScore * 100) / 100,
        achievementsUnlocked: Object.keys(achievements).length,
        overallProgress: await ProgressManager.calculateOverallProgress(userId),
      };
    } catch (error) {
      console.error('Error getting app statistics:', error);
      return {};
    }
  },
};