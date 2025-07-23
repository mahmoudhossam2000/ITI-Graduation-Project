import { DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#27548A',
    accent: '#DAA853',
    background: '#F9FAFB',
    surface: '#FFFFFF',
    text: '#183B4E',
    placeholder: '#9CA3AF',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
  },
  fonts: {
    ...DefaultTheme.fonts,
    regular: {
      fontFamily: 'Tajawal-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Tajawal-Medium',
      fontWeight: 'normal',
    },
    bold: {
      fontFamily: 'Tajawal-Bold',
      fontWeight: 'normal',
    },
  },
};