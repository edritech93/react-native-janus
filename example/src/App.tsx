import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import StackNavigation from './Router';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <StackNavigation />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
