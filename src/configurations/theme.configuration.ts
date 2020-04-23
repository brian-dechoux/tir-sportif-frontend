import { createMuiTheme } from '@material-ui/core/styles';

export const customColors = {
  white: '#ffffff',
  lightGrey: '#f5f5f5',
  black: '#000000',
  orange: '#EA6F30',
};

const muiCustomTheme = createMuiTheme({
  palette: {
    primary: {
      main: customColors.black,
      contrastText: customColors.white,
    },
    secondary: {
      main: customColors.orange,
      contrastText: customColors.white,
    },
  },
});

export const customTheme = {
  mui: muiCustomTheme,
  spacing: 2,
  header: customColors.white,
  containerBackground: customColors.white,
  mainBackground: customColors.lightGrey,
};

export const datePickerLabels = {
  clearLabel: 'VIDER',
  cancelLabel: 'ANNULER',
  okLabel: 'VALIDER',
  todayLabel: "AUJOURD'HUI",
  invalidDateMessage: 'Mauvais format de date',
};
