import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { moderateScale } from '../../libs/scaling';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackType } from '../../types/RootStackType';

interface IHome extends NativeStackScreenProps<RootStackType, 'Home'> {}

export default function Home(props: IHome) {
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <Button mode={'contained'} onPress={() => navigation.navigate('Room')}>
        {'Video Room'}
      </Button>
      <View style={styles.spacing} />
      <Button
        mode={'contained'}
        onPress={() => navigation.navigate('TextRoom')}
      >
        {'Text Room'}
      </Button>
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
