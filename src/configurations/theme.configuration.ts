import { createMuiTheme } from '@material-ui/core/styles';
import { fr } from 'date-fns/locale';

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
  selectMultipleRender: (selected: any) => (selected as string[]).join(', '),
};

// TODO Split format in pickers, server, etc
export const dateTheme = {
  format: {
    pickers: 'dd/MM/yyyy HH:mm',
    server: "dd/MM/yyyy'T'HH:mm",
  },
  timeZone: 'Europe/Paris',
  locale: fr,
  pickerLabels: {
    clearLabel: 'VIDER',
    cancelLabel: 'ANNULER',
    okLabel: 'VALIDER',
    todayLabel: "AUJOURD'HUI",
    invalidDateMessage: 'Mauvais format de date',
  }
};
