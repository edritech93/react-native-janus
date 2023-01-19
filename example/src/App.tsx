import React, { useState, useEffect } from 'react';
import { View, StyleSheet, LogBox, Platform } from 'react-native';
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {
  getPermissionCamera,
  getPermissionMicrophone,
} from './libs/permission';
import { Janus, JanusVideoRoomPlugin } from 'react-native-janus';
import { FACE_CAM, GATEWAY_URL } from './constants';
import { moderateScale } from './libs/scaling';
import RoomThumbnail from './RoomThumbnail';
import RoomControl from './RoomControl';
import RoomTalking from './RoomTalking';

Janus.setDependencies({
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
});

LogBox.ignoreAllLogs();

let pluginLocal = null;
let janus = null;
let tempPublisher = [];

export default function Room(props) {
  const profile = {
    userId: Platform.OS,
    fullName: 'Yudi Edri Alviska',
  };
  const isPrivate = false;

  const [userTalk, setUserTalk] = useState(null);
  const [dataPublisher, setDataPublisher] = useState([]);
  const [isHaveVideo, setIsHaveVideo] = useState(true);
  const [isHaveAudio, setIsHaveAudio] = useState(true);

  useEffect(() => {
    const _loadPermission = async () => {
      await getPermissionCamera();
      await getPermissionMicrophone();
      if (profile) {
        await initJanus();
      } else {
        props.showAlert({ message: 'No Profile, Need Login', type: 'danger' });
        return;
      }
    };
    _loadPermission();
    return () => {
      _dismisJanus();
    };
  }, []);

  async function initJanus() {
    try {
      const stream = await _getLocalStream();
      const arrayUpdate = [...dataPublisher];
      arrayUpdate.push({
        publisher: {
          displayName: profile.userId,
        },
        stream: stream,
      });
      setDataPublisher(arrayUpdate);
      setUserTalk(arrayUpdate[0]);
      tempPublisher = arrayUpdate;

      janus = new Janus(GATEWAY_URL.DEV);
      janus.setApiSecret('janusrocks');
      await janus.init();

      pluginLocal = new JanusVideoRoomPlugin(janus);
      pluginLocal.setRoomID(1234);
      pluginLocal.setDisplayName(profile.userId);
      pluginLocal.setOnPublishersListener((publishers) => {
        for (let i = 0; i < publishers.length; i++) {
          _receivePublisher(publishers[i]);
        }
      });
      pluginLocal.setOnPublisherJoinedListener((publisher) => {
        _receivePublisher(publisher);
      });
      pluginLocal.setOnPublisherLeftListener((publisherId) => {
        _removePublisher(publisherId);
      });
      pluginLocal.setOnWebRTCUpListener(async () => {});

      await pluginLocal.createPeer();
      await pluginLocal.connect();
      await pluginLocal.join();
      await pluginLocal.publish(stream);
    } catch (error) {
      props.showAlert({ message: error, type: 'danger' });
    }
  }

  async function _dismisJanus() {
    if (janus) {
      await janus.destroy();
    }
  }

  function _getLocalStream() {
    return new Promise(async function (resolve, reject) {
      try {
        const stream = await mediaDevices.getUserMedia({
          audio: isHaveAudio,
          video: {
            facingMode: FACE_CAM.FRONT,
          },
        });
        resolve(stream);
      } catch (error) {
        reject('No Local Stream');
      }
    });
  }

  async function _receivePublisher(publisher) {
    try {
      const pluginRemote = new JanusVideoRoomPlugin(janus);
      pluginRemote.setRoomID(1234);
      pluginRemote.setOnStreamListener((stream) => {
        const arrayUpdate = [...tempPublisher];
        arrayUpdate.push({
          publisher: publisher,
          stream: stream,
        });
        setDataPublisher(arrayUpdate);
        tempPublisher = arrayUpdate;
      });
      await pluginRemote.createPeer();
      await pluginRemote.connect();
      await pluginRemote.receive(pluginLocal.getUserPrivateID(), publisher);
    } catch (e) {
      console.error(e);
    }
  }

  async function _removePublisher(publisherId) {
    try {
      const arrayUpdate = [...tempPublisher];
      arrayUpdate.filter(
        (e) => e.publisher == null || e.publisher.id !== publisherId
      );
      setDataPublisher(arrayUpdate);
      tempPublisher = arrayUpdate;
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapMainRoom}>
        <RoomTalking isPrivate={isPrivate} user={userTalk} />
        <RoomThumbnail
          data={dataPublisher}
          isPrivate={isPrivate}
          onPressItem={(item) => setUserTalk(item)}
        />
      </View>
      <RoomControl
        navigation={props.navigation}
        isHaveVideo={isHaveVideo}
        setIsHaveVideo={setIsHaveVideo}
        isHaveAudio={isHaveAudio}
        setIsHaveAudio={setIsHaveAudio}
        pluginLocal={pluginLocal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapMainRoom: {
    flex: 1,
    marginBottom: moderateScale(100),
    borderRadius: moderateScale(8),
    paddingHorizontal: moderateScale(4),
  },
});
