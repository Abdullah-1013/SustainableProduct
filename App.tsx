import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { supabase } from './services/supbaseClient'; // Supabase client
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import MobileScreen from './screens/MobileScreen';
import CarScreen from './screens/CarScreen';
import BikeScreen from './screens/BikeScreen';
import ACScreen from './screens/ACScreen';
import WebviewScreen from './screens/WebviewScreen';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error checking session:', error);
      }
      setIsAuthenticated(!!data.session); // Set true if a session exists
      setIsLoading(false);
    };

    checkAuthStatus();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
        {/* Example for other screens */}
        <Stack.Screen name="MobileScreen" component={MobileScreen} />
        <Stack.Screen name="CarScreen" component={CarScreen} />
        <Stack.Screen name="BikeScreen" component={BikeScreen} />
        <Stack.Screen name="ACScreen" component={ACScreen} /> 
        <Stack.Screen name="WebviewScreen" component={WebviewScreen}/>
        {/* Add other screens here if they exist */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});
