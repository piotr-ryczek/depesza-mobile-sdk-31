import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Text as NativeBaseText } from 'native-base';
import { Icon } from 'react-native-elements';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

import { Loading } from 'components/loading';
import api from 'lib/api';
import { loginReader, handleError } from 'state/actions';
import { showToast } from 'lib/helpers';
import { screenStyles, formStyles } from 'styles';
import { ToastType } from 'types';
import { FormSection, FormSpace, FormWrapper } from 'components/form';
import { Separator } from 'components/content';
import { useAppDispatch } from 'lib/hooks';

export const RegisterScreen = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFacebookRegister = async () => {
    try {
      const facebookResponse = await LoginManager.logInWithPermissions([
        'public_profile',
        'email',
      ]);

      const { isCancelled, grantedPermissions } = facebookResponse;

      if (
        isCancelled ||
        !grantedPermissions ||
        !grantedPermissions.includes('email') ||
        !grantedPermissions.includes('public_profile')
      ) {
        throw new Error('Lack of facebook data or cancelled');
      }

      const accessTokenResponse = await AccessToken.getCurrentAccessToken();

      if (!accessTokenResponse) {
        throw new Error('Lack of accessTokenResponse');
      }

      const { accessToken } = accessTokenResponse;

      if (!accessToken) {
        throw new Error('Lack of accessToken');
      }

      // Start loading
      setIsLoading(true);

      const { data } = await api.authByFacebook(accessToken.toString());

      const {
        token,
        followedRegions,
        toReadArticles: savedArticles,
        hasAccess,
      } = data;

      dispatch(
        loginReader({
          jwtToken: token,
          followedRegions,
          savedArticles,
          hasAccess,
        }),
      );
      setIsLoading(false);
      navigation.navigate('ArticlesStack');
      showToast(ToastType.SUCCESS, 'Konto zostało założone.');
    } catch (error) {
      setIsLoading(false);
      LoginManager.logOut();
      dispatch(handleError(error, 'Niepoprawne logowanie', false));
    }
  };

  return (
    <ScrollView style={screenStyles.screenWrapper}>
      <Loading isLoading={isLoading} />
      <FormWrapper>
        <FormSection first>
          <Button
            style={formStyles.facebookButton}
            onPress={handleFacebookRegister}
            leftIcon={
              <Icon
                name="facebook-official"
                size={24}
                color="white"
                type="font-awesome"
              />
            }>
            <NativeBaseText style={formStyles.buttonText}>
              Załóż konto za pomocą FB
            </NativeBaseText>
          </Button>
          <FormSpace />
          <Button
            style={formStyles.secondaryButton}
            onPress={() => navigation.navigate('RegisterByEmail')}>
            <NativeBaseText style={formStyles.buttonText}>
              Załóż konto za pomocą email
            </NativeBaseText>
          </Button>
        </FormSection>
        <Separator />
        <FormSection last>
          <Button
            style={{ ...formStyles.button, ...formStyles.infoButton }}
            onPress={() => navigation.navigate('LoginStack')}>
            <NativeBaseText style={formStyles.buttonText}>
              Masz już konto? Zaloguj się
            </NativeBaseText>
          </Button>
        </FormSection>
      </FormWrapper>
    </ScrollView>
  );
};
