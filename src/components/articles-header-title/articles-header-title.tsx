import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import { useBottomSheet } from 'lib/hooks';
import { FONT_FAMILY_HEADER } from 'styles';

type ArticlesHeaderTitleProps = {
  title: string;
};

export const ArticlesHeaderTitle = (props: ArticlesHeaderTitleProps) => {
  const { title } = props;

  const { bottomSheetRef, currentIndex } = useBottomSheet();

  const handleToggleBottomSheet = () => {
    // @ts-ignore
    if (currentIndex === 0) {
      // @ts-ignore
      bottomSheetRef.current.snapToIndex(-1);
    } else {
      // @ts-ignore
      bottomSheetRef.current.snapToIndex(0);
    }
  };

  return (
    <View style={styles.header}>
      <Button
        onPress={handleToggleBottomSheet}
        title={title}
        iconRight
        icon={
          <Icon name="caret-down" size={24} color="white" type="font-awesome" />
        }
        buttonStyle={styles.drawerButton}
        titleStyle={styles.title}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    overflow: 'scroll',
  },
  drawerButton: {
    backgroundColor: 'transparent',
  },
  title: {
    color: 'white',
    fontSize: 18,

    marginRight: 8,
    fontFamily: FONT_FAMILY_HEADER,
  },
});
