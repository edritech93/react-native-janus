import React from 'react';
import { StyleSheet } from 'react-native';
import { RTCView } from 'react-native-webrtc';
import { Metrics } from './themes';

export default function RoomTalking(props) {
  const { user, isPrivate = false } = props;
  const heightStyle = {
    // height: isPrivate ? Metrics.screenHeight : '80%',
  };
  return (
    <RTCView
      style={[styles.wrapRoom, heightStyle]}
      key={Math.floor(Math.random() * 1000)}
      zOrder={0}
      objectFit={'cover'}
      streamURL={user?.stream?.toURL()}
    />
  );
}

const styles = StyleSheet.create({
  wrapRoom: {
    width: Metrics.screenWidth,
    flex: 1,
  },
});
