import React, { useReducer, useState } from 'react';
import { ScrollView, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Button,
  FormControl,
  Input,
  Text as NativeBaseText,
} from 'native-base';
import { Icon } from 'react-native-elements';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';

import { Loading } from 'components/loading';
import { BasicReducer, basicReducer } from 'lib/basic-reducer';
import api from 'lib/api';
import { loginReader, handleError } from 'state/actions';
import { showToast } from 'lib/helpers';
import { screenStyles, formStyles } from 'styles';
import { ToastType } from 'types';
import {
  FormSection,
  FormSpace,
  FormWrapper,
  ItemWrapper,
} from 'components/form';
import { Separator } from 'components/content';
import { useAppDispatch } from 'lib/hooks';

type FormValues = {
  email: string;
  password: string;
};

export const LoginScreen = () => {
  const navigation = useNavigation();

  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formValues, setFormValues] = useReducer<BasicReducer<FormValues>>(
    basicReducer,
    {
      email: '',
      password: '',
    },
  );
  const { email, password } = formValues;

  const handleTextChange = (fieldName: string) => (value: string) => {
    setFormValues({
      [fieldName]: value,
    });
  };

  const handleLoginEmail = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.loginByEmail(email, password);

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
      showToast(ToastType.SUCCESS, 'Udane logowanie.');
    } catch (error) {
      setIsLoading(false);
      dispatch(handleError(error, 'Niepoprawne logowanie', false));
    }
  };

  const handleFacebookLogin = async () => {
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
      showToast(ToastType.SUCCESS, 'Udane logowanie.');
    } catch (error) {
      setIsLoading(false);
      LoginManager.logOut();
      dispatch(handleError(error, 'Niepoprawne logowanie', false));
    }
  };

  const handleShowPassword = () => {
    setIsPasswordVisible(true);
  };

  const handleHidePassword = () => {
    setIsPasswordVisible(false);
  };

  return (
    <ScrollView style={screenStyles.screenWrapper}>
      <Loading isLoading={isLoading} />
      <FormWrapper>
        <FormSection noSpaceTop>
          <Button
            style={formStyles.facebookButton}
            onPress={handleFacebookLogin}
            leftIcon={
              <Icon
                name="facebook-official"
                size={24}
                color="white"
                type="font-awesome"
              />
            }>
            <NativeBaseText style={formStyles.buttonText}>
              Zaloguj za pomocą Facebooka
            </NativeBaseText>
          </Button>
        </FormSection>
        <Separator />
        <FormSection>
          <ItemWrapper noPaddingTop>
            <FormControl>
              <Input
                onChangeText={handleTextChange('email')}
                autoComplete="email"
                keyboardType="email-address"
                value={email}
                placeholder="Email"
              />
            </FormControl>
          </ItemWrapper>
          <ItemWrapper>
            <FormControl>
              <Input
                secureTextEntry={!isPasswordVisible}
                onChangeText={handleTextChange('password')}
                value={password}
                placeholder="Hasło"
              />
            </FormControl>
            <View
              style={[
                formStyles.iconWrapperOverInput,
                isPasswordVisible && formStyles.iconWrapperOverInputHold,
              ]}>
              <TouchableWithoutFeedback
                onPressIn={handleShowPassword}
                onPressOut={handleHidePassword}>
                <Icon
                  name={isPasswordVisible ? 'eye-slash' : 'eye'}
                  style={formStyles.iconOverInput}
                  type="font-awesome-5"
                  size={20}
                />
              </TouchableWithoutFeedback>
            </View>
          </ItemWrapper>
          <ItemWrapper button>
            <Button style={formStyles.primaryButton} onPress={handleLoginEmail}>
              <NativeBaseText style={formStyles.buttonText}>
                Zaloguj
              </NativeBaseText>
            </Button>
          </ItemWrapper>
        </FormSection>
        <Separator />
        <FormSection>
          <Button
            style={formStyles.secondaryButton}
            onPress={() => navigation.navigate('RegisterStack')}>
            <NativeBaseText style={formStyles.buttonText}>
              Nie masz konta? Zarejestruj się
            </NativeBaseText>
          </Button>
          <FormSpace />
          <Button
            style={formStyles.secondaryButton}
            onPress={() => navigation.navigate('LoginPublisher')}>
            <NativeBaseText style={formStyles.buttonText}>
              Logowanie wydawcy
            </NativeBaseText>
          </Button>
        </FormSection>
      </FormWrapper>
    </ScrollView>
  );
};
