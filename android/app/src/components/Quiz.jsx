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
  Animated,
} from 'react-native';

const { width } = Dimensions.get('window');

// Sample quiz questions generator
const generateQuizQuestions = (lesson, subject, classNumber) => {
  const questions = [
    {
      id: 1,
      question: `What is the main concept discussed in "${lesson.title}"?`,
      options: [
        'Basic understanding of the topic',
        'Advanced problem solving',
        'Historical background',
        'Practical applications'
      ],
      correctAnswer: 0,
      explanation: 'The main concept focuses on building a basic understanding which forms the foundation for advanced learning.',
    },
    {
      id: 2,
      question: `Which of the following is most important when studying ${lesson.title}?`,
      options: [
        'Memorizing all formulas',
        'Understanding concepts deeply',
        'Solving problems quickly',
        'Reading multiple books'
      ],
      correctAnswer: 1,
      explanation: 'Understanding concepts deeply helps in applying knowledge to various situations and problems.',
    },
    {
      id: 3,
      question: `How does ${lesson.title} relate to real-world applications?`,
      options: [
        'It has no real-world applications',
        'Only used in academic settings',
        'Widely used in daily life and industries',
        'Only for research purposes'
      ],
      correctAnswer: 2,
      explanation: 'Most educational concepts have practical applications in daily life and various industries.',
    },
    {
      id: 4,
      question: `What is the best approach to master ${lesson.title}?`,
      options: [
        'Practice regularly and understand concepts',
        'Only read theory',
        'Skip difficult parts',
        'Focus only on easy questions'
      ],
      correctAnswer: 0,
      explanation: 'Regular practice combined with conceptual understanding leads to mastery of any topic.',
    },
    {
      id: 5,
      question: `Which study method is most effective for ${subject}?`,
      options: [
        'Passive reading only',
        'Active learning with practice',
        'Memorization without understanding',
        'Studying just before exams'
      ],
      correctAnswer: 1,
      explanation: 'Active learning with regular practice helps in better retention and understanding of concepts.',
    },
  ];

  return questions;
};

const Quiz = ({ route, navigation }) => {
  const { lesson, subject, selectedClass } = route.params;
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [showExplanation, setShowExplanation] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    const quizQuestions = generateQuizQuestions(lesson, subject, selectedClass);
    setQuestions(quizQuestions);
  }, [lesson, subject, selectedClass]);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true })
      ]).start();
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true })
      ]).start();
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
    setShowResults(true);
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setTimeLeft(600);
    setShowExplanation(false);
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return '#27ae60';
    if (percentage >= 60) return '#f39c12';
    return '#e74c3c';
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'Excellent! Keep up the great work!';
    if (percentage >= 60) return 'Good job! Practice more to improve.';
    return 'Need more practice. Don\'t give up!';
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading quiz...</Text>
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
          <Text style={styles.headerTitle}>Quiz: {lesson.title}</Text>
          <Text style={styles.headerSubtitle}>{subject} - Class {selectedClass}</Text>
        </View>
        {!showResults && (
          <View style={styles.timerContainer}>
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        )}
      </View>

      {showResults ? (
        // Results Screen
        <ScrollView style={styles.content}>
          <View style={styles.resultsContainer}>
            <View style={styles.scoreCard}>
              <Text style={styles.congratsText}>Quiz Completed!</Text>
              <View style={styles.scoreCircle}>
                <Text style={[styles.scoreText, { color: getScoreColor() }]}>
                  {score}/{questions.length}
                </Text>
                <Text style={styles.percentageText}>
                  {Math.round((score / questions.length) * 100)}%
                </Text>
              </View>
              <Text style={[styles.scoreMessage, { color: getScoreColor() }]}>
                {getScoreMessage()}
              </Text>
            </View>

            {/* Answer Review */}
            <View style={styles.reviewSection}>
              <Text style={styles.reviewTitle}>Answer Review</Text>
              {questions.map((question, index) => {
                const userAnswer = selectedAnswers[question.id];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <View key={question.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeader}>
                      <Text style={styles.reviewQuestionNumber}>Q{index + 1}</Text>
                      <View style={[
                        styles.reviewStatus,
                        { backgroundColor: isCorrect ? '#27ae60' : '#e74c3c' }
                      ]}>
                        <Text style={styles.reviewStatusText}>
                          {isCorrect ? '✓' : '✗'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.reviewQuestion}>{question.question}</Text>
                    
                    <View style={styles.reviewAnswers}>
                      <Text style={styles.reviewLabel}>Your Answer:</Text>
                      <Text style={[
                        styles.reviewAnswer,
                        { color: isCorrect ? '#27ae60' : '#e74c3c' }
                      ]}>
                        {userAnswer !== undefined ? question.options[userAnswer] : 'Not answered'}
                      </Text>
                      
                      {!isCorrect && (
                        <>
                          <Text style={styles.reviewLabel}>Correct Answer:</Text>
                          <Text style={[styles.reviewAnswer, { color: '#27ae60' }]}>
                            {question.options[question.correctAnswer]}
                          </Text>
                        </>
                      )}
                      
                      <Text style={styles.reviewLabel}>Explanation:</Text>
                      <Text style={styles.reviewExplanation}>{question.explanation}</Text>
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Action Buttons */}
            <View style={styles.resultActions}>
              <TouchableOpacity 
                style={styles.retakeButton}
                onPress={handleRetakeQuiz}
              >
                <Text style={styles.actionButtonText}>Retake Quiz</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.backToLessonButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.actionButtonText}>Back to Lesson</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        // Quiz Screen
        <View style={styles.content}>
          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${((currentQuestion + 1) / questions.length) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {currentQuestion + 1} of {questions.length}
            </Text>
          </View>

          {/* Current Question */}
          <Animated.View style={[styles.questionContainer, { opacity: fadeAnim }]}>
            <Text style={styles.questionNumber}>
              Question {currentQuestion + 1}
            </Text>
            <Text style={styles.questionText}>
              {questions[currentQuestion]?.question}
            </Text>

            {/* Answer Options */}
            <View style={styles.optionsContainer}>
              {questions[currentQuestion]?.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedAnswers[questions[currentQuestion].id] === index && styles.selectedOption
                  ]}
                  onPress={() => handleAnswerSelect(questions[currentQuestion].id, index)}
                >
                  <View style={styles.optionContent}>
                    <View style={[
                      styles.optionIndicator,
                      selectedAnswers[questions[currentQuestion].id] === index && styles.selectedIndicator
                    ]}>
                      <Text style={[
                        styles.optionLetter,
                        selectedAnswers[questions[currentQuestion].id] === index && styles.selectedLetter
                      ]}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text style={[
                      styles.optionText,
                      selectedAnswers[questions[currentQuestion].id] === index && styles.selectedOptionText
                    ]}>
                      {option}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity 
              style={[styles.navButton, currentQuestion === 0 && styles.disabledButton]}
              onPress={handlePreviousQuestion}
              disabled={currentQuestion === 0}
            >
              <Text style={[styles.navButtonText, currentQuestion === 0 && styles.disabledText]}>
                Previous
              </Text>
            </TouchableOpacity>

            {currentQuestion === questions.length - 1 ? (
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitQuiz}
              >
                <Text style={styles.submitButtonText}>Submit Quiz</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.navButton}
                onPress={handleNextQuestion}
              >
                <Text style={styles.navButtonText}>Next</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#e0f0f0',
    marginTop: 2,
  },
  timerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  timerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  progressContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 2,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4A7C7E',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  questionContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A7C7E',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 18,
    color: '#2c3e50',
    marginBottom: 25,
    lineHeight: 26,
    fontFamily: 'serif',
  },
  optionsContainer: {
    flex: 1,
  },
  optionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#4A7C7E',
    backgroundColor: '#f8fdfc',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  optionIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  selectedIndicator: {
    backgroundColor: '#4A7C7E',
  },
  optionLetter: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  selectedLetter: {
    color: '#ffffff',
  },
  optionText: {
    fontSize: 15,
    color: '#2c3e50',
    flex: 1,
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#4A7C7E',
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 5,
  },
  navButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  disabledText: {
    color: '#95a5a6',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  resultsContainer: {
    padding: 20,
  },
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 5,
  },
  congratsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#ecf0f1',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  percentageText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  scoreMessage: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  reviewSection: {
    marginBottom: 20,
  },
  reviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewQuestionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A7C7E',
  },
  reviewStatus: {
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewStatusText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  reviewQuestion: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 10,
    lineHeight: 20,
  },
  reviewAnswers: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
  },
  reviewLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginTop: 8,
    marginBottom: 3,
  },
  reviewAnswer: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 5,
  },
  reviewExplanation: {
    fontSize: 12,
    color: '#5d6d7e',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  resultActions: {
    flexDirection: 'row',
  },
  retakeButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  backToLessonButton: {
    flex: 1,
    backgroundColor: '#4A7C7E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Quiz;