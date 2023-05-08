import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer';

import { showToast } from 'lib/helpers';
import { logout } from 'state/actions';
import { ToastType } from 'types';
import { FONT_BASE_COLOR, FONT_FAMILY_HEADER } from 'styles';
import { useAppDispatch } from 'lib/hooks';

interface DrawerContentProps
  extends DrawerContentComponentProps<DrawerContentOptions> {
  jwtToken: string;
}

export const DrawerContent = (props: DrawerContentProps) => {
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

  const newState = { ...state };
  Object.assign(newState, {
    routes: newState.routes.filter(({ name }) => name !== 'ConfirmEmail'),
  });

  return (
    <DrawerContentScrollView {...rest}>
      <DrawerItemList state={newState} {...rest} />
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
