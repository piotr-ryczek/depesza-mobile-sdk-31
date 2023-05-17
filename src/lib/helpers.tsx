import React from 'react';
import { Toast, Box, Text } from 'native-base';

import {
  ToastType,
  FieldValidationErrors,
  ValidationErrorDto,
  ThumbnailSize,
} from 'types';
import translations from './translations';
import config from './config';

// TODO: Maybe refactor
export const getCurrentRoute = (state) => {
  let actualRoute = state.routes[state.index];

  while (actualRoute.state) {
    actualRoute = actualRoute.state.routes[actualRoute.state.index];
  }

  return actualRoute;
};

export const showToast = (type: ToastType, message: string) => {
  const toastBackgroundColor = (() => {
    switch (type) {
      case ToastType.ERROR:
        return '#de4640';
      case ToastType.SUCCESS:
        return '#2f8729';
      default:
        return '#deac40';
    }
  })();

  Toast.show({
    duration: 3000,
    render: () => (
      <Box bg={toastBackgroundColor} px="6" py="3" rounded="sm" mb={6}>
        <Text style={{ color: 'white' }}>{message}</Text>
      </Box>
    ),
  });
};

export const clearUrl = (url: string) => url.replace(/^https?:\/\//, '');

export const translateValidationErrorMessage = (message: string): string =>
  translations[message];

export const prepareValidationErrors = (
  validationErrors: ValidationErrorDto[],
): FieldValidationErrors =>
  validationErrors.reduce<FieldValidationErrors>((acc, error) => {
    const { field, message } = error;

    if (!acc[field]) {
      acc[field] = [];
    }

    acc[field].push(translateValidationErrorMessage(message));

    return acc;
  }, {});

export const getImageUrl = (
  fileName: string,
  fileSize = ThumbnailSize.FULL,
): string => {
  return `${config.apiUrl}/images/${fileName}?fileSize=${fileSize}`;
};
