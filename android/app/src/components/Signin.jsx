import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  BackHandler,
  ToastAndroid,
  Vibration,
  Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Signin = ({ navigation, route }) => {
  const [formData, setFormData] = useState({
    username: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Get data passed from previous screen
  const userData = route?.params?.userData;
  const message = route?.params?.message;

  // Show welcome message if coming from signup
  React.useEffect(() => {
    if (message) {
      ToastAndroid.show(message, ToastAndroid.LONG);
    }
  }, [message]);

  // Android back button handler - prevent going back during loading
  React.useEffect(() => {
    const backAction = () => {
      if (loading) {
        ToastAndroid.show('Please wait...', ToastAndroid.SHORT);
        return true; // Prevent back during loading
      }
      
      // Allow normal back navigation (you can modify this behavior)
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [loading]);

  // Username validation
  const validateUsername = (username) => {
    if (!username.trim()) {
      return 'Username is required';
    }

    if (/^[0-9]/.test(username)) {
      return 'Username cannot start with a digit';
    }

    if (/^[^a-zA-Z_]/.test(username)) {
      return 'Username must start with a letter or underscore';
    }

    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(username)) {
      return 'Username can only contain letters, digits, and underscores';
    }

    if (username.length < 3) {
      return 'Username must be at least 3 characters long';
    }

    return null;
  };

  const validateForm = () => {
    const newErrors = {};

    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      newErrors.username = usernameError;
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      Vibration.vibrate(100);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSignIn = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate successful sign-in without API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate async operation
      
      // For simple navigation, we assume sign-in is always successful after validation
      await AsyncStorage.setItem('token', 'dummy_token'); // Store a dummy token
      await AsyncStorage.setItem('userId', formData.username); // Store username as userId
      ToastAndroid.show('Sign-in successful!', ToastAndroid.LONG);
      navigation.navigate('Dashboard');
    } catch (error) {
      // This catch block will primarily handle issues with AsyncStorage or unexpected errors
      console.error('Sign-in simulation error:', error); 
      ToastAndroid.show('Sign in failed. Please try again.', ToastAndroid.LONG);
      Vibration.vibrate([0, 100, 100, 100]);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBackToSignup = () => {
    // Go back to signup screen
    navigation.goBack();
  };

  return (
    <>
      <StatusBar 
        backgroundColor="#4A7C7E" 
        barStyle="light-content" 
        translucent={false}
      />
      
      <View style={styles.backgroundImage}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            {/* Show user info if available */}
            {userData && (
              <Text style={styles.welcomeText}>
                Welcome back, {userData.name}!
              </Text>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.username && styles.inputError
                ]}
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                maxLength={20}
                onSubmitEditing={handleSignIn}
                placeholderTextColor="#999999"
                placeholder="Enter your username"
              />
              {errors.username && (
                <Text style={styles.errorText}>{errors.username}</Text>
              )}
            </View>

            <TouchableOpacity
              style={[
                styles.signInButton,
                loading && styles.signInButtonDisabled
              ]}
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Text style={styles.signInButtonText}>
                {loading ? 'Signing In...' : 'Sign in'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginPromptContainer}
              onPress={handleGoBackToSignup}
            >
              <Text style={styles.loginPromptText}>
                Need to create an account?
              </Text>
              <Text style={styles.loginLink}>Go back to Sign up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#e8f5e8', // Light green background
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 100,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  inputContainer: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 30,
  },
  label: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    fontFamily: 'serif',
  },
  input: {
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 18,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    fontFamily: 'serif',
    elevation: 2,
  },
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 14,
    marginTop: 8,
    marginLeft: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontWeight: '500',
  },
  signInButton: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 200,
    height: 50,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    elevation: 3,
  },
  signInButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  signInButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
  loginPromptContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginPromptText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'serif',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginBottom: 4,
  },
  loginLink: {
    fontSize: 18,
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: 'serif',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default Signin;
