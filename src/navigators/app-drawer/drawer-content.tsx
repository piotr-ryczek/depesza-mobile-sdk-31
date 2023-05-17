import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import { showToast } from 'lib/helpers';
import { logout } from 'state/actions';
import { ToastType } from 'types';
import { FONT_BASE_COLOR, FONT_FAMILY_HEADER } from 'styles';
import { useAppDispatch } from 'lib/hooks';

// interface DrawerContentProps
//   extends DrawerContentComponentProps<DrawerContentOptions> {
//   jwtToken: string;
// }

// DrawerContentProps
export const DrawerContent = (props) => {
  const { jwtToken, state, ...rest } = props;
  const { navigation } = props;

  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    Alert.alert(
      'Na pewno chcesz się wylogować?',
      '',
      [
        {
          text: 'Nie',
          style: 'cancel',
        },
        {
          text: 'Tak',
          onPress: () => {
            dispatch(logout());
            navigation.navigate('ArticlesStack');
            showToast(ToastType.SUCCESS, 'Wylogowano.');
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <DrawerContentScrollView {...rest}>
      <DrawerItemList state={state} {...rest} />
      {!!jwtToken && (
        <DrawerItem
          label="Wyloguj"
          onPress={handleLogout}
          labelStyle={drawerStyles.label}
          inactiveTintColor="#9f9f9f"
        />
      )}
    </DrawerContentScrollView>
  );
};

export const drawerStyles = StyleSheet.create({
  label: {
    fontFamily: FONT_FAMILY_HEADER,
    fontSize: 18,
  },
});
