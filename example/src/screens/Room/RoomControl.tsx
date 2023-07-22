import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { moderateScale } from '../../libs/scaling';

interface IRoomControl {}

export default function RoomControl(props: IRoomControl) {
  const {
    isHaveVideo,
    setIsHaveVideo,
    isHaveAudio,
    setIsHaveAudio,
    pluginLocal,
  } = props;

  const _onPressVideo = async () => {
    if (isHaveVideo) {
      pluginLocal.pc._localStreams[0].getVideoTracks()[0].enabled = false;
    } else {
      pluginLocal.pc._localStreams[0].getVideoTracks()[0].enabled = true;
    }
    setIsHaveVideo(!isHaveVideo);
  };

  const _onPressAudio = () => {
    if (isHaveAudio) {
      pluginLocal.pc._localStreams[0].getAudioTracks()[0].enabled = false;
    } else {
      pluginLocal.pc._localStreams[0].getAudioTracks()[0].enabled = true;
    }
    setIsHaveAudio(!isHaveAudio);
  };

  const _onSwitchCamera = () => {
    pluginLocal.pc._localStreams[0]._tracks[1]._switchCamera();
  };

  return (
    <View style={styles.container}>
      <Button mode={'contained'} onPress={_onPressAudio}>
        {'AUDIO'}
      </Button>
      <Button mode={'contained'} onPress={_onPressVideo}>
        {'VIDEO'}
      </Button>
      <Button mode={'contained'} onPress={() => {}}>
        {'PHONE'}
      </Button>
      <Button mode={'contained'} onPress={_onSwitchCamera}>
        {'SWITCH'}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: moderateScale(60),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
  },
  iconStyle: {
    height: moderateScale(40),
    width: moderateScale(40),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
  },
  iconEnd: {
    backgroundColor: 'red',
  },
});
