import { createMuiTheme } from '@material-ui/core/styles';
import { fr } from 'date-fns/locale';
import { LabelDisplayedRowsArgs } from '@material-ui/core/TablePagination/TablePagination';

export const customColors = {
  white: '#ffffff',
  lightGrey: '#f5f5f5',
  black: '#000000',
  orange: '#EA6F30',
  red: '#bf1c2e',
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

// TODO adjust width 100% on header and main
//  adjust main height 100% screen
export const customTheme = {
  mui: muiCustomTheme,
  spacing: 2,
  header: customColors.white,
  containerBackground: customColors.white,
  mainBackground: customColors.lightGrey,
  selectMultipleRender: (selected: any) => (selected as string[]).join(', '),
  selectSimpleRender: (selected: any) => (selected as string),
};

// TODO Split format in pickers, server, etc
export const dateTheme = {
  format: {
    timePickers: 'HH:mm',
    datePickers: 'dd/MM/yyyy',
    dateTimePickers: 'dd/MM/yyyy HH:mm',
    dateTimeServer: "yyyy-MM-dd'T'HH:mm:ssx",
    dateServer: 'yyyy-MM-dd',
  },
  timeZone: 'Europe/Paris',
  locale: fr,
  pickerLabels: {
    clearLabel: 'VIDER',
    cancelLabel: 'ANNULER',
    okLabel: 'VALIDER',
    todayLabel: "AUJOURD'HUI",
    invalidDateMessage: 'Mauvais format de date',
  },
};

export const booleanToText = (bool: boolean) => (bool ? 'Oui' : 'Non');

export const paginationTheme = {
  rowsPerPage: "Nombre d'éléments par page",
  displayedRowsArgs: (paginationInfo: LabelDisplayedRowsArgs) =>
    `Element ${paginationInfo.from} à ${paginationInfo.to}, sur un total de: ${paginationInfo.count}`,
};
