import { createMuiTheme } from '@material-ui/core/styles';

const customTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#ffffff',
      dark: '#f5f5f5',
      contrastText: '#000000',
    },
    secondary: {
      main: '#EA6F30',
      contrastText: '#ffffff',
    },
  },
});

export default customTheme;
