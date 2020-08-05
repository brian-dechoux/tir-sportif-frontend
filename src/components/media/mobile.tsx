import { useMediaQuery } from 'react-responsive';
import { customTheme } from '../../configurations/theme.configuration';

type MobileProps = {
  children: any;
};

const Mobile = (props: MobileProps) => {
  const { children } = props;
  const isMobile = useMediaQuery({maxWidth: customTheme.mediaBreakpoint - 1})
  return isMobile ? children : null
}

export default Mobile;
