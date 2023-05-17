import React, { useReducer, useState } from 'react';
import { ScrollView, View, TouchableWithoutFeedback } from 'react-native';
import {
  Button,
  FormControl,
  Input,
  Text as NativeBaseText,
} from 'native-base';
import { Icon } from 'react-native-elements';
import { StackScreenProps } from '@react-navigation/stack';

import { Loading } from 'components/loading';
import { screenStyles, formStyles } from 'styles';
import { BasicReducer, basicReducer } from 'lib/basic-reducer';
import api from 'lib/api';
import { loginPublisher, handleError } from 'state/actions';
import { showToast } from 'lib/helpers';
import { ToastType } from 'types';
import { FormSection, FormWrapper, ItemWrapper } from 'components/form';
import { LoginStackParamList } from 'navigators/login-stack';
import { useAppDispatch } from 'lib/hooks';

type LoginPublisherScreenProps = StackScreenProps<
  LoginStackParamList,
  'LoginPublisher'
>;

type FormValues = {
  email: string;
  password: string;
  code: string;
};

export const LoginPublisherScreen = (props: LoginPublisherScreenProps) => {
  const { navigation } = props;

  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [formValues, setFormValues] = useReducer<BasicReducer<FormValues>>(
    basicReducer,
    {
      email: '',
      password: '',
      code: '',
    },
  );
  const { email, password, code } = formValues;

  const handleTextChange = (fieldName: string) => (value: string) => {
    setFormValues({
      [fieldName]: value,
    });
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.publisherLogin(email, password, code);
      const { token, articlesReported, publisherId } = data;

      dispatch(loginPublisher(token, articlesReported, publisherId));
      setIsLoading(false);
      navigation.navigate('ArticlesStack' as never);
      showToast(ToastType.SUCCESS, 'Udane logowanie.');
    } catch (error) {
      setIsLoading(false);
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
        <FormSection first last>
          <ItemWrapper>
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
          <ItemWrapper>
            <FormControl>
              <Input
                secureTextEntry
                onChangeText={handleTextChange('code')}
                value={code}
                placeholder="Kod 2FA"
              />
            </FormControl>
          </ItemWrapper>
          <ItemWrapper button>
            <Button style={formStyles.primaryButton} onPress={handleLogin}>
              <NativeBaseText style={formStyles.buttonText}>
                Zaloguj
              </NativeBaseText>
            </Button>
          </ItemWrapper>
        </FormSection>
      </FormWrapper>
    </ScrollView>
  );
};
