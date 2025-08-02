import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SubmitComplaintScreen from '../screens/SubmitComplaintScreen';
import TrackComplaintScreen from '../screens/TrackComplaintScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyComplaintsScreen from '../screens/MyComplaintsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { currentUser } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SubmitComplaint') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'TrackComplaint') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#27548A',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#27548A',
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          tabBarLabel: 'الرئيسية',
          headerTitle: 'شكوتك'
        }} 
      />
      <Tab.Screen 
        name="SubmitComplaint" 
        component={SubmitComplaintScreen} 
        options={{ 
          tabBarLabel: 'تقديم شكوى',
          headerTitle: 'تقديم شكوى'
        }} 
      />
      <Tab.Screen 
        name="TrackComplaint" 
        component={TrackComplaintScreen} 
        options={{ 
          tabBarLabel: 'تتبع شكوى',
          headerTitle: 'تتبع الشكوى'
        }} 
      />
      {currentUser && (
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen} 
          options={{ 
            tabBarLabel: 'الملف الشخصي',
            headerTitle: 'الملف الشخصي'
          }} 
        />
      )}
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#27548A',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={TabNavigator} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerTitle: 'تسجيل الدخول' }} 
        />
        <Stack.Screen 
          name="Signup" 
          component={SignupScreen} 
          options={{ headerTitle: 'إنشاء حساب' }} 
        />
        <Stack.Screen 
          name="MyComplaints" 
          component={MyComplaintsScreen} 
          options={{ headerTitle: 'شكاويي' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;