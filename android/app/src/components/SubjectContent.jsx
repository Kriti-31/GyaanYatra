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
} from 'react-native';

const { width } = Dimensions.get('window');

// Sample educational content structure
const getContentForSubject = (subject, classNumber) => {
  const contentMap = {
    'MATHS': {
      6: [
        { id: 1, title: 'Knowing Our Numbers', chapters: ['Reading Large Numbers', 'Place Value', 'Comparing Numbers', 'Rounding Off'] },
        { id: 2, title: 'Whole Numbers', chapters: ['Number Line', 'Properties of Operations', 'Patterns'] },
        { id: 3, title: 'Playing with Numbers', chapters: ['Factors and Multiples', 'Prime Numbers', 'Tests of Divisibility'] },
        { id: 4, title: 'Basic Geometrical Ideas', chapters: ['Points and Lines', 'Line Segments', 'Angles'] },
        { id: 5, title: 'Understanding Elementary Shapes', chapters: ['Triangles', 'Quadrilaterals', 'Circles'] },
      ],
      7: [
        { id: 1, title: 'Integers', chapters: ['Introduction', 'Addition', 'Subtraction', 'Multiplication', 'Division'] },
        { id: 2, title: 'Fractions and Decimals', chapters: ['Proper Fractions', 'Improper Fractions', 'Decimal Numbers'] },
        { id: 3, title: 'Data Handling', chapters: ['Collection of Data', 'Organization of Data', 'Bar Graphs'] },
        { id: 4, title: 'Simple Equations', chapters: ['Setting up Equations', 'Solving Equations'] },
        { id: 5, title: 'Lines and Angles', chapters: ['Related Angles', 'Pairs of Lines'] },
      ],
      8: [
        { id: 1, title: 'Rational Numbers', chapters: ['Introduction', 'Properties', 'Representation on Number Line'] },
        { id: 2, title: 'Linear Equations in One Variable', chapters: ['Solving Equations', 'Applications'] },
        { id: 3, title: 'Understanding Quadrilaterals', chapters: ['Polygons', 'Types of Quadrilaterals'] },
        { id: 4, title: 'Practical Geometry', chapters: ['Construction of Quadrilaterals'] },
        { id: 5, title: 'Data Handling', chapters: ['Histograms', 'Circle Graphs', 'Probability'] },
      ],
      9: [
        { id: 1, title: 'Number Systems', chapters: ['Rational Numbers', 'Irrational Numbers', 'Real Numbers'] },
        { id: 2, title: 'Polynomials', chapters: ['Introduction', 'Remainder Theorem', 'Factorization'] },
        { id: 3, title: 'Coordinate Geometry', chapters: ['Cartesian System', 'Plotting Points'] },
        { id: 4, title: 'Linear Equations in Two Variables', chapters: ['Solutions', 'Graphical Method'] },
        { id: 5, title: 'Introduction to Euclid\'s Geometry', chapters: ['Basic Concepts', 'Axioms and Postulates'] },
      ],
      10: [
        { id: 1, title: 'Real Numbers', chapters: ['Euclid\'s Division Algorithm', 'Fundamental Theorem'] },
        { id: 2, title: 'Polynomials', chapters: ['Geometrical Meaning of Zeroes', 'Relationship between Zeroes'] },
        { id: 3, title: 'Pair of Linear Equations', chapters: ['Graphical Method', 'Algebraic Methods'] },
        { id: 4, title: 'Quadratic Equations', chapters: ['Standard Form', 'Solution by Factorization'] },
        { id: 5, title: 'Arithmetic Progressions', chapters: ['Introduction', 'nth Term', 'Sum of Terms'] },
      ],
    },
    'SCIENCE': {
      6: [
        { id: 1, title: 'Food: Where Does It Come From?', chapters: ['Plant Sources', 'Animal Sources', 'Food Habits'] },
        { id: 2, title: 'Components of Food', chapters: ['Nutrients', 'Balanced Diet', 'Deficiency Diseases'] },
        { id: 3, title: 'Fibre to Fabric', chapters: ['Plant Fibres', 'Animal Fibres', 'Spinning'] },
        { id: 4, title: 'Sorting Materials into Groups', chapters: ['Objects and Materials', 'Properties of Materials'] },
        { id: 5, title: 'Separation of Substances', chapters: ['Methods of Separation', 'Applications'] },
      ],
      7: [
        { id: 1, title: 'Nutrition in Plants', chapters: ['Photosynthesis', 'Other Modes of Nutrition'] },
        { id: 2, title: 'Nutrition in Animals', chapters: ['Different Ways of Taking Food', 'Digestion in Humans'] },
        { id: 3, title: 'Heat', chapters: ['Hot and Cold', 'Measuring Temperature', 'Transfer of Heat'] },
        { id: 4, title: 'Acids, Bases and Salts', chapters: ['Acids and Bases', 'Natural Indicators'] },
        { id: 5, title: 'Physical and Chemical Changes', chapters: ['Physical Changes', 'Chemical Changes'] },
      ],
      8: [
        { id: 1, title: 'Crop Production and Management', chapters: ['Agricultural Practices', 'Preparation of Soil'] },
        { id: 2, title: 'Microorganisms', chapters: ['Where do Microorganisms Live?', 'Useful Microorganisms'] },
        { id: 3, title: 'Synthetic Fibres and Plastics', chapters: ['Synthetic Fibres', 'Characteristics of Plastics'] },
        { id: 4, title: 'Materials: Metals and Non-metals', chapters: ['Properties of Metals', 'Uses of Metals'] },
        { id: 5, title: 'Coal and Petroleum', chapters: ['Natural Resources', 'Formation of Coal'] },
      ],
      9: [
        { id: 1, title: 'Matter in Our Surroundings', chapters: ['Physical Nature of Matter', 'Characteristics of Particles'] },
        { id: 2, title: 'Is Matter Around Us Pure?', chapters: ['Mixtures', 'Solutions', 'Separation Methods'] },
        { id: 3, title: 'Atoms and Molecules', chapters: ['Laws of Chemical Combination', 'Atomic Theory'] },
        { id: 4, title: 'Structure of the Atom', chapters: ['Discovery of Electron', 'Thomson Model'] },
        { id: 5, title: 'The Fundamental Unit of Life', chapters: ['Cell Theory', 'Cell Organelles'] },
      ],
      10: [
        { id: 1, title: 'Chemical Reactions and Equations', chapters: ['Chemical Equations', 'Types of Reactions'] },
        { id: 2, title: 'Acids, Bases and Salts', chapters: ['Understanding Acids and Bases', 'pH Scale'] },
        { id: 3, title: 'Metals and Non-metals', chapters: ['Physical Properties', 'Chemical Properties'] },
        { id: 4, title: 'Life Processes', chapters: ['Nutrition', 'Respiration', 'Transportation'] },
        { id: 5, title: 'Control and Coordination', chapters: ['Nervous System', 'Hormones'] },
      ],
    },
    'ENGLISH': {
      6: [
        { id: 1, title: 'A Pact with the Sun', chapters: ['Who I Am', 'The Friendly Mongoose', 'The Shepherd\'s Treasure'] },
        { id: 2, title: 'Honeysuckle', chapters: ['Who Did Patrick\'s Homework?', 'How the Dog Found Himself'] },
        { id: 3, title: 'Grammar', chapters: ['Nouns', 'Pronouns', 'Verbs', 'Adjectives'] },
        { id: 4, title: 'Writing Skills', chapters: ['Paragraph Writing', 'Letter Writing', 'Story Writing'] },
        { id: 5, title: 'Poetry', chapters: ['Poem Appreciation', 'Rhyme and Rhythm'] },
      ],
      7: [
        { id: 1, title: 'Honeycomb', chapters: ['Three Questions', 'A Gift of Chappals', 'Gopal and the Hilsa Fish'] },
        { id: 2, title: 'An Alien Hand', chapters: ['The Tiny Teacher', 'Bringing up Kari'] },
        { id: 3, title: 'Grammar', chapters: ['Tenses', 'Voice', 'Reported Speech'] },
        { id: 4, title: 'Writing Skills', chapters: ['Descriptive Writing', 'Narrative Writing'] },
        { id: 5, title: 'Poetry', chapters: ['The Squirrel', 'The Rebel'] },
      ],
    },
    'HINDI': {
      6: [
        { id: 1, title: 'वसंत', chapters: ['वह चिड़िया जो', 'बचपन', 'नादान दोस्त'] },
        { id: 2, title: 'दूर्वा', chapters: ['कलम', 'किताब', 'घर'] },
        { id: 3, title: 'व्याकरण', chapters: ['संज्ञा', 'सर्वनाम', 'विशेषण'] },
        { id: 4, title: 'लेखन कौशल', chapters: ['अनुच्छेद लेखन', 'पत्र लेखन'] },
      ],
      7: [
        { id: 1, title: 'वसंत', chapters: ['हम पंछी उन्मुक्त गगन के', 'दादी माँ', 'हिमालय की बेटियाँ'] },
        { id: 2, title: 'दूर्वा', chapters: ['चिड़िया की बच्ची', 'शेखचिल्ली', 'मैं हूँ रोबोट'] },
        { id: 3, title: 'व्याकरण', chapters: ['काल', 'वाच्य', 'उपसर्ग-प्रत्यय'] },
      ],
    },
    'S.S.T': {
      6: [
        { id: 1, title: 'History: Our Pasts-I', chapters: ['What, Where, How and When?', 'From Hunting to Farming'] },
        { id: 2, title: 'Geography: The Earth', chapters: ['The Earth in the Solar System', 'Globe: Latitudes and Longitudes'] },
        { id: 3, title: 'Civics: Social and Political Life', chapters: ['Understanding Diversity', 'Government'] },
      ],
      7: [
        { id: 1, title: 'History: Our Pasts-II', chapters: ['Tracing Changes', 'New Kings and Kingdoms'] },
        { id: 2, title: 'Geography: Our Environment', chapters: ['Environment', 'Inside Our Earth'] },
        { id: 3, title: 'Civics: Social and Political Life-II', chapters: ['On Equality', 'Role of Government'] },
      ],
      8: [
        { id: 1, title: 'History: Our Pasts-III', chapters: ['How, When and Where', 'From Trade to Territory'] },
        { id: 2, title: 'Geography: Resources and Development', chapters: ['Resources', 'Land, Soil, Water'] },
        { id: 3, title: 'Civics: Social and Political Life-III', chapters: ['The Indian Constitution', 'Parliament'] },
      ],
    },
  };

  return contentMap[subject]?.[classNumber] || [];
};

const SubjectContent = ({ route, navigation }) => {
  const { subject, selectedClass } = route.params;
  const [content, setContent] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    const subjectContent = getContentForSubject(subject, selectedClass);
    setContent(subjectContent);
  }, [subject, selectedClass]);

  const handleLessonPress = (lesson) => {
    setSelectedLesson(lesson);
    navigation.navigate('LessonDetail', { 
      lesson, 
      subject, 
      selectedClass 
    });
  };

  const handleQuizPress = (lesson) => {
    navigation.navigate('Quiz', { 
      lesson, 
      subject, 
      selectedClass 
    });
  };

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
          <Text style={styles.headerTitle}>{subject}</Text>
          <Text style={styles.headerSubtitle}>Class {selectedClass}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Progress Overview */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>0/{content.length}</Text>
              <Text style={styles.progressLabel}>Lessons Completed</Text>
            </View>
            <View style={styles.progressItem}>
              <Text style={styles.progressNumber}>0%</Text>
              <Text style={styles.progressLabel}>Overall Progress</Text>
            </View>
          </View>
        </View>

        {/* Lessons List */}
        <View style={styles.lessonsSection}>
          <Text style={styles.sectionTitle}>Lessons</Text>
          {content.map((lesson, index) => (
            <View key={lesson.id} style={styles.lessonCard}>
              <TouchableOpacity
                style={styles.lessonHeader}
                onPress={() => handleLessonPress(lesson)}
                activeOpacity={0.8}
              >
                <View style={styles.lessonInfo}>
                  <Text style={styles.lessonNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </Text>
                  <View style={styles.lessonDetails}>
                    <Text style={styles.lessonTitle}>{lesson.title}</Text>
                    <Text style={styles.chapterCount}>
                      {lesson.chapters.length} chapters
                    </Text>
                  </View>
                </View>
                <View style={styles.lessonActions}>
                  <TouchableOpacity
                    style={styles.quizButton}
                    onPress={() => handleQuizPress(lesson)}
                  >
                    <Text style={styles.quizButtonText}>Quiz</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
              
              {/* Chapter Preview */}
              <View style={styles.chapterPreview}>
                {lesson.chapters.slice(0, 3).map((chapter, chapterIndex) => (
                  <Text key={chapterIndex} style={styles.chapterItem}>
                    • {chapter}
                  </Text>
                ))}
                {lesson.chapters.length > 3 && (
                  <Text style={styles.moreChapters}>
                    +{lesson.chapters.length - 3} more chapters
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Study Tools */}
        <View style={styles.toolsSection}>
          <Text style={styles.sectionTitle}>Study Tools</Text>
          <View style={styles.toolsGrid}>
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => Alert.alert('Practice Tests', 'Feature coming soon!')}
            >
              <Text style={styles.toolIcon}>🎯</Text>
              <Text style={styles.toolTitle}>Practice Tests</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => Alert.alert('Flashcards', 'Feature coming soon!')}
            >
              <Text style={styles.toolIcon}>📚</Text>
              <Text style={styles.toolTitle}>Flashcards</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => Alert.alert('Notes', 'Feature coming soon!')}
            >
              <Text style={styles.toolIcon}>📝</Text>
              <Text style={styles.toolTitle}>Notes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.toolCard}
              onPress={() => Alert.alert('Videos', 'Feature coming soon!')}
            >
              <Text style={styles.toolIcon}>🎥</Text>
              <Text style={styles.toolTitle}>Videos</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'serif',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0f0f0',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  progressSection: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    fontFamily: 'serif',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
  progressItem: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A7C7E',
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  lessonsSection: {
    marginBottom: 20,
  },
  lessonCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    overflow: 'hidden',
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  lessonInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A7C7E',
    marginRight: 15,
    width: 30,
  },
  lessonDetails: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 3,
  },
  chapterCount: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  lessonActions: {
    marginLeft: 10,
  },
  quizButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  quizButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  chapterPreview: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  chapterItem: {
    fontSize: 13,
    color: '#5d6d7e',
    marginBottom: 3,
  },
  moreChapters: {
    fontSize: 12,
    color: '#3498db',
    fontStyle: 'italic',
    marginTop: 5,
  },
  toolsSection: {
    marginBottom: 30,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  toolCard: {
    width: (width - 60) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 3,
  },
  toolIcon: {
    fontSize: 30,
    marginBottom: 10,
  },
  toolTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
});

export default SubjectContent;