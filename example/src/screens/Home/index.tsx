import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { moderateScale } from '../../libs/scaling';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackType } from '../../types/RootStackType';

interface IHome extends NativeStackScreenProps<RootStackType, 'Home'> {}

export default function Home(props: IHome) {
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <Button title={'ROOM'} onPress={() => navigation.navigate('Room')} />
      <View style={styles.spacing} />
      <Button
        title={'DATA CHANNEL'}
        onPress={() => navigation.navigate('DataChannel')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spacing: {
    marginBottom: moderateScale(16),
  },
});
