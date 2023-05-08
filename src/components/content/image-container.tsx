import React from 'react';
import { StyleSheet, View, Image, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SMALL_SPACE, ACTIVE_OPACITY } from 'styles';

type ImageContainerProps = {
  src: string;
};

export const ImageContainer = (props: ImageContainerProps) => {
  const { src } = props;

  const goToImage = () => {
    Linking.openURL(src);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity activeOpacity={ACTIVE_OPACITY} onPress={goToImage}>
        <Image
          source={{
            uri: src,
          }}
          resizeMode="cover"
          style={styles.image}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: SMALL_SPACE,
    marginBottom: SMALL_SPACE,
  },
  image: {
    width: '100%',
    height: 240,
  },
});
