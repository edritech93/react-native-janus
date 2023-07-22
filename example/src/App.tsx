import React from 'react';
import { StyleSheet, SafeAreaView, StatusBar, LogBox } from 'react-native';
import StackNavigation from './Router';

LogBox.ignoreAllLogs();

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
