import { useMediaQuery } from 'react-responsive';
import { customTheme } from '../../configurations/theme.configuration';

type DesktopContainerProps = {
  children: any;
};

const Desktop = (props: DesktopContainerProps) => {
  const { children } = props;
  const isDesktop = useMediaQuery({minWidth: customTheme.mediaBreakpoint})
  return isDesktop ? children : null
}


export default Desktop;
