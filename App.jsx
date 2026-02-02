import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Signup from './android/app/src/components/Signup';
import Signin from './android/app/src/components/Signin';
import LoginScreen from './android/app/src/components/LoginScreen';
import SubjectSelection from './android/app/src/components/SubjectSelection';
import Dashboard from './android/app/src/components/Dashboard';
import SubjectContent from './android/app/src/components/SubjectContent';
import LessonDetail from './android/app/src/components/LessonDetail';
import Quiz from './android/app/src/components/Quiz';
import Profile from './android/app/src/components/Profile';
import Search from './android/app/src/components/Search';
import ProgressTracker from './android/app/src/components/ProgressTracker';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Signup"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen 
          name="Signup" 
          component={Signup} 
          options={{ 
            headerShown: false,
            gestureEnabled: false // Prevent swipe back from signup
          }} 
        />
        <Stack.Screen 
          name="Signin" 
          component={Signin} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="Dashboard" 
          component={Dashboard} 
          options={{ 
            headerShown: false,
            gestureEnabled: false // Prevent swipe back from dashboard
          }} 
        />
        <Stack.Screen 
          name="SubjectSelection" 
          component={SubjectSelection} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="SubjectContent" 
          component={SubjectContent} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="LessonDetail" 
          component={LessonDetail} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="Quiz" 
          component={Quiz} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="Profile" 
          component={Profile} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="Search" 
          component={Search} 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="ProgressTracker" 
          component={ProgressTracker} 
          options={{ 
            headerShown: false 
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}