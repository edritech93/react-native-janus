import * as React from 'react';
import {
  View,
  Image,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
} from 'react-native';
import {Text} from './Text';
import {moderateScale} from '../libs/scaling';
import {Metrics} from '../themes';

interface EmptyStateProps {
  image?: ImageSourcePropType | undefined | null;
  label?: string;
  style?: StyleProp<ViewStyle>;
}

const EmptyState = (props: EmptyStateProps) => {
  const {image = null, label = 'No. Data', style} = props;
  return (
    <View style={[styles.container, style]}>
      {image && <Image style={styles.imgStyle} source={image} />}
      <Text>{label}</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Metrics.screenHeight * 0.4,
  },
  imgStyle: {
    marginBottom: moderateScale(16),
  },
});
