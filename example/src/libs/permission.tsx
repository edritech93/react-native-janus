import {Platform, Alert} from 'react-native';
import {
  PERMISSIONS,
  openSettings,
  check,
  request,
  RESULTS,
} from 'react-native-permissions';

const MSG_PERMISSION_BLOCKED =
  'Permission is blocked, enable manually on setting';
const MSG_PERMISSION_UNAVAILABLE = 'Permission Unavailable';

export async function getPermissionCamera() {
  if (Platform.OS === 'ios') {
    await check(PERMISSIONS.IOS.CAMERA).then(async status => {
      if (status === RESULTS.GRANTED) {
        return RESULTS.GRANTED;
      } else if (status === RESULTS.DENIED) {
        return await request(PERMISSIONS.IOS.CAMERA);
      } else if (status === RESULTS.UNAVAILABLE) {
        _showAlertUnavailable('Camera');
        return RESULTS.UNAVAILABLE;
      } else {
        _showAlertBlocked('Camera');
        return null;
      }
    });
  } else if (Platform.OS === 'android') {
    await check(PERMISSIONS.ANDROID.CAMERA).then(async status => {
      if (status === RESULTS.GRANTED) {
        return RESULTS.GRANTED;
      } else if (status === RESULTS.DENIED) {
        return await request(PERMISSIONS.ANDROID.CAMERA);
      } else if (status === RESULTS.UNAVAILABLE) {
        _showAlertUnavailable('Camera');
        return RESULTS.UNAVAILABLE;
      } else {
        _showAlertBlocked('Camera');
        return null;
      }
    });
  } else {
    return MSG_PERMISSION_BLOCKED;
  }
}

export async function getPermissionMicrophone() {
  if (Platform.OS === 'ios') {
    await check(PERMISSIONS.IOS.MICROPHONE).then(async status => {
      if (status === RESULTS.GRANTED) {
        return RESULTS.GRANTED;
      } else if (status === RESULTS.DENIED) {
        return await request(PERMISSIONS.IOS.MICROPHONE);
      } else if (status === RESULTS.UNAVAILABLE) {
        _showAlertUnavailable('Microphone');
        return RESULTS.UNAVAILABLE;
      } else {
        _showAlertBlocked('Microphone');
        return null;
      }
    });
  } else if (Platform.OS === 'android') {
    await check(PERMISSIONS.ANDROID.RECORD_AUDIO).then(async status => {
      if (status === RESULTS.GRANTED) {
        return RESULTS.GRANTED;
      } else if (status === RESULTS.DENIED) {
        return await request(PERMISSIONS.ANDROID.RECORD_AUDIO);
      } else if (status === RESULTS.UNAVAILABLE) {
        _showAlertUnavailable('Camera');
        return RESULTS.UNAVAILABLE;
      } else {
        _showAlertBlocked('Camera');
        return null;
      }
    });
  } else {
    return MSG_PERMISSION_BLOCKED;
  }
}

export async function getPermissionReadStorage() {
  if (Platform.OS === 'ios') {
    await check(PERMISSIONS.IOS.PHOTO_LIBRARY).then(async status => {
      if (status === RESULTS.GRANTED) {
        return RESULTS.GRANTED;
      } else if (status === RESULTS.DENIED) {
        return await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      } else if (status === RESULTS.UNAVAILABLE) {
        _showAlertUnavailable('Library');
        return RESULTS.UNAVAILABLE;
      } else {
        _showAlertBlocked('Library');
        return null;
      }
    });
  } else if (Platform.OS === 'android') {
    await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE).then(
      async status => {
        if (status === RESULTS.GRANTED) {
          return RESULTS.GRANTED;
        } else if (status === RESULTS.DENIED) {
          return await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        } else if (status === RESULTS.UNAVAILABLE) {
          _showAlertUnavailable('Read Storage');
          return RESULTS.UNAVAILABLE;
        } else {
          _showAlertBlocked('Read Storage');
          return null;
        }
      },
    );
  } else {
    return MSG_PERMISSION_BLOCKED;
  }
}

export async function getPermissionWriteStorage() {
  // NOTE: Android Only
  if (Platform.OS !== 'android') {
    return;
  }
  await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(async status => {
    if (status === RESULTS.GRANTED) {
      return RESULTS.GRANTED;
    } else if (status === RESULTS.DENIED) {
      return await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
    } else if (status === RESULTS.UNAVAILABLE) {
      _showAlertUnavailable('Write Storage');
      return RESULTS.UNAVAILABLE;
    } else {
      _showAlertBlocked('Write Storage');
      return null;
    }
  });
}

function _showAlertBlocked(message = '') {
  Alert.alert(
    'Information',
    `${message} ${MSG_PERMISSION_BLOCKED}`,
    [
      {
        text: 'Cancel',
        onPress: () => {},
      },
      {
        text: 'Setting',
        onPress: () => openSettings(),
      },
    ],
    {cancelable: true},
  );
}

function _showAlertUnavailable(message = '') {
  Alert.alert(
    'Information',
    `${message} ${MSG_PERMISSION_UNAVAILABLE}`,
    [
      {
        text: 'Ok',
        onPress: () => {},
      },
    ],
    {cancelable: true},
  );
}
