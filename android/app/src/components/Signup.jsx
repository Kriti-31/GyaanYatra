import React, { useState } from 'react';
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

const Signup = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Android back button handler
  React.useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.class.trim()) {
      newErrors.class = 'Class is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      Vibration.vibrate(100);
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
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

  // Handle form submission
  // In your Signup.jsx, update the handleSubmit function:

const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  setLoading(true);
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    ToastAndroid.show('Done', ToastAndroid.SHORT);
    //Vibration.vibrate(200);
    
    // Navigate to Sign-in screen instead of resetting form
    navigation.navigate('Signin', { 
      userData: formData,
      message: 'Account created! Please sign in with your username.'
    });
    
  } catch (error) {
    ToastAndroid.show('Something went wrong. Please try again.', ToastAndroid.LONG);
    Vibration.vibrate([0, 100, 100, 100]);
  } finally {
    setLoading(false);
  }
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
            {/* App Title */}
            <Text style={styles.appTitle}>GYAANYATRA</Text>

            {/* Form Container */}
            <View style={styles.formContainer}>
              
              {/* Name Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.name && styles.inputError
                  ]}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  maxLength={50}
                  placeholderTextColor="#999999"
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              {/* Class Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Class</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.class && styles.inputError
                  ]}
                  value={formData.class}
                  onChangeText={(value) => handleInputChange('class', value)}
                  autoCapitalize="words"
                  autoCorrect={false}
                  returnKeyType="next"
                  maxLength={20}
                  placeholderTextColor="#999999"
                />
                {errors.class && (
                  <Text style={styles.errorText}>{errors.class}</Text>
                )}
              </View>

              {/* Phone Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone No</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.phone && styles.inputError
                  ]}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  keyboardType="phone-pad"
                  returnKeyType="done"
                  maxLength={10}
                  onSubmitEditing={handleSubmit}
                  placeholderTextColor="#999999"
                />
                {errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>

              {/* Next Button */}
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  loading && styles.nextButtonDisabled
                ]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                <Text style={styles.nextButtonText}>
                  {loading ? 'Processing...' : 'Next →'}
                </Text>
              </TouchableOpacity>
            </View>
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
    paddingHorizontal: 30,
    paddingVertical: 60,
  },
  
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000', // Black text as shown in screenshot
    textAlign: 'center',
    marginBottom: 50,
    letterSpacing: 2,
    fontFamily: 'serif',
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  
  formContainer: {
    width: '100%',
    maxWidth: 320,
    paddingHorizontal: 10,
  },
  
  inputContainer: {
    marginBottom: 22,
  },
  
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Black text matching screenshot
    marginBottom: 8,
    fontFamily: 'serif',
  },
  
  input: {
    height: 48,
    backgroundColor: '#FFFFFF', // White background as shown
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    fontFamily: 'serif',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  inputError: {
    borderColor: '#FF6B6B',
    borderWidth: 2,
  },
  
  errorText: {
    color: '#FF6B6B',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  
  nextButton: {
    backgroundColor: '#E8E8E8', // Light gray matching the screenshot
    height: 48,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  
  nextButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  
  nextButtonText: {
    color: '#000000', // Black text on light button
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'serif',
  },
});

export default Signup;