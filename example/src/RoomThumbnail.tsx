import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlatList, EmptyState } from './components';
import { moderateScale } from './libs/scaling';
import { Metrics } from './themes';
import ItemRoom from './ItemRoom';

export default function RoomThumbnail(props) {
  const {
    data = [],
    containerStyle,
    listStyle,
    onPressItem,
    isPrivate = false,
  } = props;

  const _renderItem = ({ item }) => (
    <ItemRoom item={item} onPress={() => onPressItem(item)} />
  );

  function _renderEmpty() {
    return <EmptyState label={'No Participants'} style={styles.emptyStyle} />;
  }

  const positionStyle = isPrivate ? styles.privateView : styles.publicView;

  return (
    <View style={[styles.container, positionStyle, containerStyle]}>
      <FlatList
        data={data}
        horizontal={true}
        renderItem={_renderItem}
        ListEmptyComponent={_renderEmpty()}
        containerStyle={[styles.listStyle, listStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  listStyle: {},
  emptyStyle: {
    marginTop: 0,
    marginLeft: Metrics.screenWidth * 0.33,
  },
  privateView: {
    position: 'absolute',
    bottom: 0,
    left: moderateScale(8),
    right: moderateScale(8),
  },
  publicView: {
    height: moderateScale(100),
    marginTop: moderateScale(4),
  },
});
