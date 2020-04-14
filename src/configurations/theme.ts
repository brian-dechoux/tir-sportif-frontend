import { createMuiTheme } from '@material-ui/core/styles';

const customTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#ffffff',
    },
    secondary: {
      main: '#f2f2f2',
    },
    info: {
      main: '#000000',
    },
  },
});

export default customTheme;
