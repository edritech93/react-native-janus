import * as React from 'react';
import {
  FlatList as DefaultFlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  FlatListProps,
} from 'react-native';

interface IFlatList extends FlatListProps<any> {
  onLimitUp?: () => void;
  onLimitDown?: () => void;
  flatListRef?: (args: React.Ref<any>) => void;
}

export default function FlatList(props: IFlatList) {
  const { children, style, onLimitUp, onLimitDown, flatListRef, ...restProps } =
    props;

  const REF_LIST = React.useRef<any>();

  React.useEffect(() => {
    if (flatListRef) {
      flatListRef(REF_LIST.current);
    }
  }, [flatListRef]);

  const _handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    try {
      const limit = event.nativeEvent.contentOffset.y;
      if (limit > 30) {
        if (onLimitUp) {
          onLimitUp();
        }
      } else {
        if (onLimitDown) {
          onLimitDown();
        }
      }
    } catch (error) {
      console.log('_handleScroll => ', error);
    }
  };

  return (
    <DefaultFlatList
      style={[styles.container, style]}
      ref={REF_LIST}
      keyExtractor={(_, index) => index.toString()}
      onScroll={_handleScroll}
      scrollEventThrottle={500}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      {...restProps}
    >
      {children}
    </DefaultFlatList>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
