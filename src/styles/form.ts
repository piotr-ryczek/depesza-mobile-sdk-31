import { StyleSheet } from 'react-native';
import { BORDER_RADIUS, CAPTION_FONT_SIZE } from './config';

export const BUTTON_PRIMARY_BACKGROUND_COLOR = '#565db3';
export const BUTTON_SECONDARY_BACKGROUND_COLOR = '#17BEBB';

export const formStyles = StyleSheet.create({
  facebookButton: {
    backgroundColor: '#3b5998',
  },
  primaryButton: {
    backgroundColor: BUTTON_PRIMARY_BACKGROUND_COLOR,
  },
  secondaryButton: {
    backgroundColor: BUTTON_SECONDARY_BACKGROUND_COLOR,
  },
  infoButton: {
    backgroundColor: '#43b7e0',
  },
  button: {
    borderRadius: BORDER_RADIUS,
  },
  buttonText: {
    color: 'white',
    fontSize: CAPTION_FONT_SIZE,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  iconWrapperOverInput: {
    position: 'absolute',
    bottom: 12,
    right: 10,
    zIndex: 10000,
  },
  iconWrapperOverInputHold: {
    right: 9,
  },
  iconOverInput: {
    opacity: 0.8,
  },
});
