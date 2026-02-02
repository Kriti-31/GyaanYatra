import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [classValue, setClassValue] = useState('');

  const handleLogin = () => {
    // Add your login logic here
    console.log('Login pressed:', { username, classValue });
    // Navigate to dashboard after login
    if (username.trim() && classValue.trim()) {
      navigation.navigate('Dashboard');
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleBackToSignUp = () => {
    // Navigate back to signup screen
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      <View style={styles.backgroundImage}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.contentContainer}>
            
            {/* Title */}
            <Text style={styles.title}>GYAANYATRA</Text>
            
            {/* Form Container */}
            <View style={styles.formContainer}>
              
              {/* Username Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.textInput}
                  value={username}
                  onChangeText={setUsername}
                  placeholder=""
                  placeholderTextColor="#666"
                  autoCapitalize="none"
                />
              </View>
              
              {/* Class Field */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Class</Text>
                <TextInput
                  style={styles.textInput}
                  value={classValue}
                  onChangeText={setClassValue}
                  placeholder=""
                  placeholderTextColor="#666"
                  keyboardType="numeric"
                />
              </View>
              
              {/* Login Button */}
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
              </TouchableOpacity>
              
              {/* Back to Sign Up Link */}
              <TouchableOpacity onPress={handleBackToSignUp} style={styles.backToSignUpContainer}>
                <Text style={styles.backToSignUpText}>
                  Don't have an account? Sign up here
                </Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#e8f5e8', // Light green background instead of image
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
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
    maxWidth: 280,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // Black text matching screenshot
    marginBottom: 8,
    fontFamily: 'serif',
  },
  textInput: {
    width: '100%',
    height: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#2c2c2c',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4a9b8e',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backToSignUpContainer: {
    alignItems: 'center',
  },
  backToSignUpText: {
    color: '#2c2c2c',
    fontSize: 14,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
