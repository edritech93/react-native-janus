import React, { useState, useEffect } from 'react';
import { Button, TextInput } from 'react-native-paper';
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import { StyleSheet, Text, View, FlatList, Platform } from 'react-native';
import { Janus, JanusTextRoomPlugin } from 'react-native-janus';
import { moderateScale } from '../../libs/scaling';
import { FACE_CAM, GATEWAY_URL } from '../../constants';
import type { DataChatType } from '../../types/DataChatType';

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

export default function TextRoom() {
  const profile = {
    userId: Platform.OS,
    fullName: 'User 1',
  };
  const [textSend, setTextSend] = useState<string>('');
  const [dataChat, setDataChat] = useState<DataChatType[]>([]);

  useEffect(() => {
    // TODO: init dataChannel
    // const temp: DataChatType[] = [];
    // for (let i = 0; i < 20; i++) {
    //   temp.push({ userId: i.toString(), message: `Test${i}` });
    // }
    // setDataChat(temp);
  }, []);

  useEffect(() => {
    initJanus();
    return () => {
      _dismissJanus();
    };
  }, []);

  async function initJanus() {
    try {
      const stream = await _getLocalStream();

      janus = new Janus(GATEWAY_URL.DEV);
      janus.setApiSecret('janusrocks');
      await janus.init();

      pluginLocal = new JanusTextRoomPlugin(janus);
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
        // _removePublisher(publisherId);
      });
      pluginLocal.setOnWebRTCUpListener(async () => {});

      await pluginLocal.connect();
      await pluginLocal.createPeer();
      await pluginLocal.setRoomID(ROOM_ID, true);
      // await pluginLocal.setupTextRoom();
      await pluginLocal.join();
      // await pluginLocal.publish(stream);
      console.log('pluginLocal => ', pluginLocal);
    } catch (error) {
      // props.showAlert({ message: error, type: 'danger' });
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
          audio: true,
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
      const pluginRemote = new JanusTextRoomPlugin(janus);
      pluginRemote.setRoomID(ROOM_ID);
      pluginRemote.setOnStreamListener((stream: any) => {
        const arrayUpdate = [...tempPublisher];
        arrayUpdate.push({
          publisher: publisher,
          stream: stream,
        });
        // setDataPublisher(arrayUpdate);
        tempPublisher = arrayUpdate;
      });
      await pluginRemote.createPeer();
      await pluginRemote.connect();
      await pluginRemote.receive(pluginLocal.getUserPrivateID(), publisher);
    } catch (e) {
      console.error(e);
    }
  }

  function _onSend() {
    // let message = {
    //   textroom: 'message',
    //   transaction: Janus.randomString(12),
    //   room: myroom,
    //   text: data,
    // };
  }

  const _renderItem = ({ item }: { item: DataChatType }) => (
    <View style={styles.wrapItem}>
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={dataChat}
        keyExtractor={(_, index) => index.toString()}
        renderItem={_renderItem}
      />
      <View style={styles.wrapInput}>
        <TextInput
          style={styles.input}
          value={textSend}
          placeholder={'Type Here...'}
          onChangeText={(e: string) => setTextSend(e)}
        />
        <Button
          style={styles.button}
          mode={'contained'}
          onPress={() => _onSend()}
        >
          {'SEND'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapItem: {
    backgroundColor: 'cyan',
    marginBottom: moderateScale(16),
    marginHorizontal: moderateScale(16),
    borderRadius: moderateScale(8),
  },
  wrapInput: {
    flexDirection: 'row',
    padding: moderateScale(16),
  },
  input: {
    flex: 1,
    marginRight: moderateScale(8),
  },
  button: {
    height: moderateScale(40),
  },
});
