import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { moderateScale } from '../../libs/scaling';
import { RTCView } from 'react-native-webrtc';

interface IItemRoom {
  item: any;
  onPress: () => void;
}

export default function ItemRoom(props: IItemRoom) {
  const { item, onPress } = props;
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <RTCView
        style={styles.wrapRoom}
        key={Math.floor(Math.random() * 1000)}
        zOrder={1}
        objectFit={'cover'}
        streamURL={item?.stream?.toURL()}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginRight: moderateScale(4),
    backgroundColor: 'white',
  },
  wrapRoom: {
    height: moderateScale(100),
    width: moderateScale(100),
  },
});
