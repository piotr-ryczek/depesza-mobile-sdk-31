import { extendTheme } from 'native-base';

export const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        rounded: 'lg',
      },
    },
  },
});
