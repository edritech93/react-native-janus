import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const screenWidth = width < height ? width : height;
const screenHeight = width < height ? height : width;

const metrics = {
  screenWidth,
  screenHeight,
};

export default metrics;
