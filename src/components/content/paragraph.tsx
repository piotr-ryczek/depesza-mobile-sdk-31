import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  SPACE,
  LINE_HEIGHT,
  FONT_FAMILY_TEXT,
  PARAGRAPH_FONT_SIZE,
  FONT_BASE_COLOR,
} from 'styles';

type ParagraphProps = {
  children: ReactNode;
  margin?: boolean;
  italic?: boolean;
};

export const Paragraph = (props: ParagraphProps) => {
  const { children, margin = true, italic = false } = props;

  return (
    <View style={[styles.wrapper, margin && { marginBottom: SPACE }]}>
      <Text selectable style={[styles.text, italic && styles.textItalic]}>
        {children}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  text: {
    fontSize: PARAGRAPH_FONT_SIZE,
    fontFamily: FONT_FAMILY_TEXT,
    lineHeight: LINE_HEIGHT,
    color: FONT_BASE_COLOR,
    flex: 1,
  },
  textItalic: {
    fontFamily: 'OpenSans-LightItalic',
  },
});
