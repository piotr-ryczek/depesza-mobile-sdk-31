import React, { useEffect } from 'react';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer';
import { NavigatorScreenParams } from '@react-navigation/native';

import {
  ArticlesStack,
  ArticlesStackParamList,
} from 'navigators/articles-stack';
import { LoginStack, LoginStackParamList } from 'navigators/login-stack';
import {
  RegisterStack,
  RegisterStackParamList,
} from 'navigators/register-stack';
import {
  PublishersStack,
  PublishersStackParamList,
} from 'navigators/publishers-stack';
import { AboutStack, AboutStackParamList } from 'navigators/about-stack';
import { ConfirmEmailScreen } from 'screens/confirm-email';

import { AppState } from 'state/app-state';
import { refreshToken } from 'state/actions';
import { UserRole } from 'types';
import { useAppSelector, useAppDispatch } from 'lib/hooks';

import { DrawerContent, drawerStyles } from './drawer-content';

export type DrawerParamList = {
  ArticlesStack: NavigatorScreenParams<ArticlesStackParamList>;
  PublishersStack: NavigatorScreenParams<PublishersStackParamList>;
  RegisterStack: NavigatorScreenParams<RegisterStackParamList>;
  LoginStack: NavigatorScreenParams<LoginStackParamList>;
  AboutStack: NavigatorScreenParams<AboutStackParamList>;
  ConfirmEmail: {
    verificationCode: string;
  };
};

const Drawer = createDrawerNavigator<DrawerParamList>();
const { Navigator, Screen } = Drawer;

export const AppDrawer = () => {
  const dispatch = useAppDispatch();
  const { jwtToken, role, hasAccess } = useAppSelector((state) => state);

  useEffect(() => {
    if (jwtToken) {
      dispatch(refreshToken());
    }
  }, []);

  // Currently impossible in second condition (isLoggedReader && !hasAccess) as logging without access results in error HAS_NOT_ACCESS
  const isLoggedReader = !!(jwtToken && role === UserRole.READER);
  const isNotLoggedInOrHasNotAccess =
    !jwtToken || (isLoggedReader && !hasAccess);

  return (
    <Navigator
      screenOptions={{
        drawerPosition: 'right',
        drawerType: 'front',
        drawerInactiveTintColor: '#9f9f9f',
        drawerActiveTintColor: 'black',
        drawerActiveBackgroundColor: 'transparent',
        drawerLabelStyle: drawerStyles.label,
        header: () => null,
      }}
      initialRouteName="ArticlesStack"
      drawerContent={(
        props, // DrawerContentComponentProps<DrawerContentOptions>
      ) => <DrawerContent {...props} jwtToken={jwtToken} />}>
      <Screen
        name="ArticlesStack"
        options={{ title: 'Artykuły' }}
        component={ArticlesStack}
      />
      <Screen
        name="PublishersStack"
        options={{ title: 'Autorzy' }}
        component={PublishersStack}
      />

      {!jwtToken && (
        <Screen
          name="RegisterStack"
          options={{ title: 'Załóż konto' }}
          component={RegisterStack}
        />
      )}
      {!jwtToken && (
        <Screen
          name="LoginStack"
          options={{ title: 'Logowanie' }}
          component={LoginStack}
        />
      )}

      {/* {isLoggedReader && (
        <Screen
          name="Settings"
          options={{ title: 'Ustawienia' }}
          component={SettingsScreen}
        />
      )} */}
      <Screen
        name="AboutStack"
        options={{ title: 'O aplikacji' }}
        component={AboutStack}
      />
      {isNotLoggedInOrHasNotAccess && (
        <Screen
          name="ConfirmEmail"
          component={ConfirmEmailScreen}
          options={{
            headerTitle: 'Potwierdzenie email',
            drawerItemStyle: { height: 0 },
          }}
        />
      )}
    </Navigator>
  );
};
