import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';

// Sample search data - in a real app, this would come from a database
const getSearchableContent = () => {
  return [
    // Math content
    { id: 1, type: 'lesson', subject: 'MATHS', class: 6, title: 'Knowing Our Numbers', keywords: ['numbers', 'place value', 'comparing'] },
    { id: 2, type: 'lesson', subject: 'MATHS', class: 6, title: 'Whole Numbers', keywords: ['whole', 'number line', 'properties'] },
    { id: 3, type: 'lesson', subject: 'MATHS', class: 7, title: 'Integers', keywords: ['integers', 'positive', 'negative', 'addition'] },
    { id: 4, type: 'lesson', subject: 'MATHS', class: 8, title: 'Rational Numbers', keywords: ['rational', 'fractions', 'decimals'] },
    { id: 5, type: 'lesson', subject: 'MATHS', class: 9, title: 'Number Systems', keywords: ['real', 'irrational', 'rational'] },
    { id: 6, type: 'lesson', subject: 'MATHS', class: 10, title: 'Real Numbers', keywords: ['euclid', 'algorithm', 'fundamental'] },

    // Science content
    { id: 7, type: 'lesson', subject: 'SCIENCE', class: 6, title: 'Food: Where Does It Come From?', keywords: ['food', 'plants', 'animals'] },
    { id: 8, type: 'lesson', subject: 'SCIENCE', class: 7, title: 'Nutrition in Plants', keywords: ['photosynthesis', 'chlorophyll', 'plants'] },
    { id: 9, type: 'lesson', subject: 'SCIENCE', class: 8, title: 'Crop Production', keywords: ['agriculture', 'farming', 'crops'] },
    { id: 10, type: 'lesson', subject: 'SCIENCE', class: 9, title: 'Matter in Our Surroundings', keywords: ['matter', 'states', 'particles'] },
    { id: 11, type: 'lesson', subject: 'SCIENCE', class: 10, title: 'Chemical Reactions', keywords: ['chemical', 'reactions', 'equations'] },

    // English content
    { id: 12, type: 'lesson', subject: 'ENGLISH', class: 6, title: 'A Pact with the Sun', keywords: ['story', 'reading', 'comprehension'] },
    { id: 13, type: 'lesson', subject: 'ENGLISH', class: 7, title: 'Honeycomb', keywords: ['literature', 'stories', 'poems'] },

    // Hindi content
    { id: 14, type: 'lesson', subject: 'HINDI', class: 6, title: 'वसंत', keywords: ['हिंदी', 'कविता', 'गद्य'] },
    { id: 15, type: 'lesson', subject: 'HINDI', class: 7, title: 'हम पंछी उन्मुक्त गगन के', keywords: ['कविता', 'स्वतंत्रता', 'पक्षी'] },

    // SST content
    { id: 16, type: 'lesson', subject: 'S.S.T', class: 6, title: 'History: Our Pasts-I', keywords: ['history', 'ancient', 'civilization'] },
    { id: 17, type: 'lesson', subject: 'S.S.T', class: 6, title: 'Geography: The Earth', keywords: ['earth', 'geography', 'solar system'] },
    { id: 18, type: 'lesson', subject: 'S.S.T', class: 6, title: 'Civics: Social and Political Life', keywords: ['civics', 'government', 'society'] },

    // Concepts and terms
    { id: 19, type: 'concept', subject: 'MATHS', title: 'Algebra', keywords: ['algebra', 'variables', 'equations', 'expressions'] },
    { id: 20, type: 'concept', subject: 'MATHS', title: 'Geometry', keywords: ['geometry', 'shapes', 'angles', 'triangles'] },
    { id: 21, type: 'concept', subject: 'SCIENCE', title: 'Photosynthesis', keywords: ['photosynthesis', 'plants', 'chlorophyll', 'sunlight'] },
    { id: 22, type: 'concept', subject: 'SCIENCE', title: 'Chemical Bonding', keywords: ['chemical', 'bonding', 'molecules', 'atoms'] },
  ];
};

const Search = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    'photosynthesis', 'integers', 'chemical reactions', 'geometry'
  ]);
  const [popularSearches] = useState([
    'algebra', 'history', 'english grammar', 'science experiments', 'math formulas'
  ]);
  const [searchableContent] = useState(getSearchableContent());

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const performSearch = (query) => {
    const lowercaseQuery = query.toLowerCase();
    const results = searchableContent.filter(item => {
      return (
        item.title.toLowerCase().includes(lowercaseQuery) ||
        item.subject.toLowerCase().includes(lowercaseQuery) ||
        item.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
      );
    });
    setSearchResults(results);
  };

  const handleSearchItemPress = (item) => {
    if (item.type === 'lesson') {
      // Navigate to SubjectContent with the specific lesson
      navigation.navigate('SubjectContent', {
        subject: item.subject,
        selectedClass: item.class
      });
    }
    
    // Add to recent searches if not already present
    if (!recentSearches.includes(searchQuery) && searchQuery.trim().length > 0) {
      setRecentSearches(prev => [searchQuery, ...prev.slice(0, 4)]);
    }
  };

  const handleQuickSearch = (query) => {
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => handleSearchItemPress(item)}
    >
      <View style={styles.resultContent}>
        <View style={styles.resultHeader}>
          <Text style={styles.resultTitle}>{item.title}</Text>
          <View style={styles.resultTags}>
            <Text style={styles.subjectTag}>{item.subject}</Text>
            {item.class && <Text style={styles.classTag}>Class {item.class}</Text>}
          </View>
        </View>
        <Text style={styles.resultType}>
          {item.type === 'lesson' ? '📚 Lesson' : '💡 Concept'}
        </Text>
      </View>
      <Text style={styles.resultArrow}>→</Text>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>Search</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search lessons, topics, subjects..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus={true}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {searchResults.length > 0 ? (
          // Search Results
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Search Results ({searchResults.length})
            </Text>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
            />
          </View>
        ) : searchQuery.length > 0 ? (
          // No Results
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found</Text>
            <Text style={styles.noResultsSubtext}>
              Try searching for different keywords or check your spelling
            </Text>
          </View>
        ) : (
          // Default State (Recent & Popular Searches)
          <>
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Searches</Text>
                <View style={styles.tagContainer}>
                  {recentSearches.map((search, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.searchTag}
                      onPress={() => handleQuickSearch(search)}
                    >
                      <Text style={styles.searchTagText}>🕒 {search}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Searches</Text>
              <View style={styles.tagContainer}>
                {popularSearches.map((search, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.popularTag}
                    onPress={() => handleQuickSearch(search)}
                  >
                    <Text style={styles.popularTagText}>🔥 {search}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browse by Subject</Text>
              <View style={styles.subjectGrid}>
                {['MATHS', 'SCIENCE', 'ENGLISH', 'HINDI', 'S.S.T'].map((subject) => (
                  <TouchableOpacity
                    key={subject}
                    style={styles.subjectCard}
                    onPress={() => handleQuickSearch(subject)}
                  >
                    <Text style={styles.subjectIcon}>
                      {subject === 'MATHS' ? '🔢' :
                       subject === 'SCIENCE' ? '🔬' :
                       subject === 'ENGLISH' ? '📖' :
                       subject === 'HINDI' ? '🇮🇳' : '🌍'}
                    </Text>
                    <Text style={styles.subjectName}>{subject}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Search Tips</Text>
              <View style={styles.tipsContainer}>
                <Text style={styles.tip}>💡 Try searching for specific topics like "photosynthesis" or "algebra"</Text>
                <Text style={styles.tip}>💡 Search by subject name to see all related content</Text>
                <Text style={styles.tip}>💡 Use simple keywords for better results</Text>
              </View>
            </View>
          </>
        )}

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
  searchContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#2c3e50',
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    fontSize: 16,
    color: '#7f8c8d',
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
  resultItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  resultContent: {
    flex: 1,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  resultTags: {
    flexDirection: 'row',
  },
  subjectTag: {
    backgroundColor: '#4A7C7E',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 5,
  },
  classTag: {
    backgroundColor: '#3498db',
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 5,
  },
  resultType: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  resultArrow: {
    fontSize: 18,
    color: '#bdc3c7',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7f8c8d',
    marginBottom: 10,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  searchTag: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  searchTagText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  popularTag: {
    backgroundColor: '#fff3cd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  popularTagText: {
    fontSize: 14,
    color: '#856404',
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  subjectCard: {
    width: '30%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  subjectIcon: {
    fontSize: 30,
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  tipsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    elevation: 1,
  },
  tip: {
    fontSize: 14,
    color: '#5d6d7e',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default Search;