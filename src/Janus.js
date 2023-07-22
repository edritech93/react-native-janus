import JanusSocket from './utils/JanusSocket';
import JanusUtils from './utils/JanusUtils';

export default class Janus {
  /**
   * @type {RTCSessionDescription}
   */
  static RTCSessionDescription;
  /**
   * @type {RTCPeerConnection}
   */
  static RTCPeerConnection;
  /**
   * @type {RTCIceCandidate}
   */
  static RTCIceCandidate;

  apiSecret = null;
  iceServers = [];

  constructor(address) {
    this.socket = new JanusSocket(address);
  }

  /**
   *
   * @param RTCSessionDescription
   * @param RTCPeerConnection
   * @param RTCIceCandidate
   * @param MediaStream
   */
  static setDependencies = ({
    RTCSessionDescription,
    RTCPeerConnection,
    RTCIceCandidate,
    MediaStream,
  }) => {
    Janus.RTCSessionDescription = RTCSessionDescription;
    Janus.RTCPeerConnection = RTCPeerConnection;
    Janus.RTCIceCandidate = RTCIceCandidate;
    Janus.MediaStream = MediaStream;
  };

  init = async () => {
    await this.socket.connect();
    JanusUtils.log('init_janus', 'success');
  };

  destroy = async () => {
    try {
      await this.socket.sendAsync({
        janus: 'destroy',
        session_id: this.socket.sessionID,
      });
    } catch (e) {
      JanusUtils.log('destroy_janus', e);
    }
    try {
      await this.socket.disconnect();
    } catch (e) {
      JanusUtils.log('destroy_socket', e);
    }
  };

  /**
   *
   * @param secret
   */
  setApiSecret = (secret) => {
    this.apiSecret = secret;
  };

  /**
   *
   * @param {Object[]} iceServers
   */
  setIceServers = (iceServers) => {
    this.iceServers = iceServers;
  };
}
