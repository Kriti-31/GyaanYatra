import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
  StatusBar,
  Modal,
} from 'react-native';

const { width } = Dimensions.get('window');

// Sample lesson content with detailed explanations
const getLessonContent = (lesson, subject, classNumber) => {
  // This would typically come from a database or API
  const sampleContent = {
    introduction: `Welcome to ${lesson.title}! This lesson will help you understand the fundamental concepts and build a strong foundation in ${subject}.`,
    objectives: [
      `Understand the basic concepts of ${lesson.title}`,
      'Apply learned concepts to solve problems',
      'Develop analytical thinking skills',
      'Prepare for assessments and exams',
    ],
    keyTerms: [
      { term: 'Definition', meaning: 'A precise explanation of the meaning of a concept' },
      { term: 'Example', meaning: 'A specific instance that illustrates a general principle' },
      { term: 'Application', meaning: 'The practical use of knowledge in real situations' },
    ],
    examples: [
      {
        title: 'Example 1',
        problem: 'Sample problem statement related to the lesson topic.',
        solution: 'Step-by-step solution with detailed explanation.',
      },
      {
        title: 'Example 2',
        problem: 'Another problem to reinforce understanding.',
        solution: 'Comprehensive solution with tips and tricks.',
      },
    ],
    practiceQuestions: [
      'Practice question 1 related to the lesson content',
      'Practice question 2 to test understanding',
      'Practice question 3 for application of concepts',
    ],
  };

  return sampleContent;
};

const LessonDetail = ({ route, navigation }) => {
  const { lesson, subject, selectedClass } = route.params;
  const [content, setContent] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [userNotes, setUserNotes] = useState('');

  useEffect(() => {
    const lessonContent = getLessonContent(lesson, subject, selectedClass);
    setContent(lessonContent);
  }, [lesson, subject, selectedClass]);

  const handleQuizPress = () => {
    navigation.navigate('Quiz', { 
      lesson, 
      subject, 
      selectedClass 
    });
  };

  const handleMarkComplete = () => {
    Alert.alert(
      'Mark as Complete',
      'Have you finished studying this lesson?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Complete',
          onPress: () => {
            Alert.alert('Success', 'Lesson marked as complete!');
            // Here you would update the progress in your database
          },
        },
      ]
    );
  };

  const handleSaveNotes = () => {
    // Here you would save notes to AsyncStorage or database
    Alert.alert('Success', 'Notes saved successfully!');
    setShowNotes(false);
  };

  if (!content) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading content...</Text>
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
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{lesson.title}</Text>
          <Text style={styles.headerSubtitle}>{subject} - Class {selectedClass}</Text>
        </View>
        <TouchableOpacity 
          style={styles.notesButton}
          onPress={() => setShowNotes(true)}
        >
          <Text style={styles.notesButtonText}>📝</Text>
        </TouchableOpacity>
      </View>

      {/* Chapter Navigation */}
      <View style={styles.chapterNav}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {lesson.chapters.map((chapter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.chapterTab,
                selectedChapter === index && styles.activeChapterTab
              ]}
              onPress={() => setSelectedChapter(index)}
            >
              <Text style={[
                styles.chapterTabText,
                selectedChapter === index && styles.activeChapterTabText
              ]}>
                {index + 1}. {chapter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Current Chapter Content */}
        <View style={styles.chapterContent}>
          <Text style={styles.chapterTitle}>
            Chapter {selectedChapter + 1}: {lesson.chapters[selectedChapter]}
          </Text>
          
          {/* Introduction */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.sectionText}>{content.introduction}</Text>
          </View>

          {/* Learning Objectives */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learning Objectives</Text>
            {content.objectives.map((objective, index) => (
              <View key={index} style={styles.objectiveItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.objectiveText}>{objective}</Text>
              </View>
            ))}
          </View>

          {/* Key Terms */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Terms</Text>
            {content.keyTerms.map((term, index) => (
              <View key={index} style={styles.termCard}>
                <Text style={styles.termTitle}>{term.term}</Text>
                <Text style={styles.termMeaning}>{term.meaning}</Text>
              </View>
            ))}
          </View>

          {/* Examples */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Examples</Text>
            {content.examples.map((example, index) => (
              <View key={index} style={styles.exampleCard}>
                <Text style={styles.exampleTitle}>{example.title}</Text>
                <View style={styles.problemSection}>
                  <Text style={styles.problemLabel}>Problem:</Text>
                  <Text style={styles.problemText}>{example.problem}</Text>
                </View>
                <View style={styles.solutionSection}>
                  <Text style={styles.solutionLabel}>Solution:</Text>
                  <Text style={styles.solutionText}>{example.solution}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Practice Questions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Practice Questions</Text>
            {content.practiceQuestions.map((question, index) => (
              <View key={index} style={styles.questionCard}>
                <Text style={styles.questionNumber}>Q{index + 1}.</Text>
                <Text style={styles.questionText}>{question}</Text>
              </View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity 
          style={styles.quizButton}
          onPress={handleQuizPress}
        >
          <Text style={styles.actionButtonText}>Take Quiz</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={handleMarkComplete}
        >
          <Text style={styles.actionButtonText}>Mark Complete</Text>
        </TouchableOpacity>
      </View>

      {/* Notes Modal */}
      <Modal
        visible={showNotes}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotes(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>My Notes</Text>
              <TouchableOpacity onPress={() => setShowNotes(false)}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.notesArea}>
              <Text style={styles.notesPlaceholder}>
                {userNotes || 'Add your notes here...\n\nThis is where you can write down important points, questions, or any thoughts about this lesson.'}
              </Text>
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.saveNotesButton}
                onPress={handleSaveNotes}
              >
                <Text style={styles.saveNotesText}>Save Notes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#e0f0f0',
    marginTop: 2,
  },
  notesButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesButtonText: {
    fontSize: 18,
  },
  chapterNav: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    elevation: 2,
  },
  chapterTab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  activeChapterTab: {
    backgroundColor: '#4A7C7E',
  },
  chapterTabText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '500',
  },
  activeChapterTabText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  chapterContent: {
    paddingVertical: 20,
  },
  chapterTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    fontFamily: 'serif',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 10,
    fontFamily: 'serif',
  },
  sectionText: {
    fontSize: 14,
    color: '#5d6d7e',
    lineHeight: 22,
  },
  objectiveItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    color: '#4A7C7E',
    marginRight: 10,
    marginTop: 2,
  },
  objectiveText: {
    fontSize: 14,
    color: '#5d6d7e',
    flex: 1,
    lineHeight: 20,
  },
  termCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  termTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  termMeaning: {
    fontSize: 13,
    color: '#5d6d7e',
    lineHeight: 18,
  },
  exampleCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  exampleTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 10,
  },
  problemSection: {
    marginBottom: 10,
  },
  problemLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#34495e',
    marginBottom: 5,
  },
  problemText: {
    fontSize: 13,
    color: '#5d6d7e',
    lineHeight: 18,
  },
  solutionSection: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
  },
  solutionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 5,
  },
  solutionText: {
    fontSize: 13,
    color: '#5d6d7e',
    lineHeight: 18,
  },
  questionCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3498db',
    marginRight: 10,
    width: 30,
  },
  questionText: {
    fontSize: 14,
    color: '#5d6d7e',
    flex: 1,
    lineHeight: 20,
  },
  actionBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 5,
  },
  quizButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    height: '70%',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4A7C7E',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  modalCloseButton: {
    fontSize: 20,
    color: '#ffffff',
  },
  notesArea: {
    flex: 1,
    padding: 20,
  },
  notesPlaceholder: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 22,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  saveNotesButton: {
    backgroundColor: '#4A7C7E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveNotesText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LessonDetail;