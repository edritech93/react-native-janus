import * as React from 'react';
import { Text as DefaultText, StyleSheet, TextProps } from 'react-native';
import { moderateScale } from '../libs/scaling';
import { useTheme } from 'react-native-paper';
import { Fonts } from '../themes';

interface IText extends TextProps {}

export const Text = (props: IText) => {
  const { children, style, ...restProps } = props;
  const { colors } = useTheme();
  return (
    <DefaultText
      style={[styles.textStyle, { color: colors.onBackground }, style]}
      {...restProps}
    >
      {children}
    </DefaultText>
  );
};

export const Title = (props: IText) => {
  const { children, style, ...restProps } = props;
  return (
    <Text style={[styles.titleStyle, style]} {...restProps}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontFamily: Fonts.type.regular,
    fontSize: moderateScale(16),
    lineHeight: moderateScale(25),
  },
  titleStyle: {
    fontFamily: Fonts.type.semiBold,
    fontSize: moderateScale(24),
    lineHeight: moderateScale(29),
    fontWeight: '600',
  },
});
