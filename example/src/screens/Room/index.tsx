import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
} from '../../libs/permission';
import { Janus, JanusVideoRoomPlugin } from 'react-native-janus';
import { FACE_CAM, GATEWAY_URL } from '../../constants';
import { moderateScale } from '../../libs/scaling';
import RoomThumbnail from './RoomThumbnail';
import RoomControl from './RoomControl';
import RoomTalking from './RoomTalking';

Janus.setDependencies({
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
  MediaStream,
});

let janus: any = null;
let pluginLocal: any = null;
let tempPublisher: any[] = [];
const ROOM_ID = 1234;

interface IRoom {
  showAlert: (args: any) => void;
}

export default function Room(props: IRoom) {
  const profile = {
    userId: Platform.OS,
    fullName: 'User 1',
  };
  const isPrivate = false;

  const [userTalk, setUserTalk] = useState<any>(null);
  const [dataPublisher, setDataPublisher] = useState<any[]>([]);
  const [isHaveVideo, setIsHaveVideo] = useState<boolean>(true);
  const [isHaveAudio, setIsHaveAudio] = useState<boolean>(true);

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
      _dismissJanus();
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
      pluginLocal.setDisplayName(profile.userId);
      pluginLocal.setOnPublishersListener((publishers: []) => {
        for (let i = 0; i < publishers.length; i++) {
          _receivePublisher(publishers[i]);
        }
      });
      pluginLocal.setOnPublisherJoinedListener((publisher: any) => {
        _receivePublisher(publisher);
      });
      pluginLocal.setOnPublisherLeftListener((publisherId: string) => {
        _removePublisher(publisherId);
      });
      pluginLocal.setOnWebRTCUpListener(async () => {});

      await pluginLocal.createPeer();
      await pluginLocal.connect();
      await pluginLocal.setRoomID(ROOM_ID, true);
      await pluginLocal.join();
      await pluginLocal.publish(stream);
    } catch (error) {
      props.showAlert({ message: error, type: 'danger' });
    }
  }

  async function _dismissJanus() {
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

  async function _receivePublisher(publisher: any) {
    try {
      const pluginRemote = new JanusVideoRoomPlugin(janus);
      pluginRemote.setRoomID(ROOM_ID);
      pluginRemote.setOnStreamListener((stream: any) => {
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

  async function _removePublisher(publisherId: string) {
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
  },
});
