import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import Room from './screens/Room';
import Home from './screens/Home';
import TextRoom from './screens/TextRoom';

const Stack = createNativeStackNavigator();

export default function StackNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Home'}>
        <Stack.Screen name={'Home'} component={Home} />
        <Stack.Screen name={'Room'} component={Room} />
        <Stack.Screen name={'TextRoom'} component={TextRoom} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
