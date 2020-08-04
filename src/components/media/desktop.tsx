import { useMediaQuery } from 'react-responsive';

type DesktopContainerProps = {
  children: any;
};

// FIXME Deprecated as there's a warning using useMediaQuery
const Desktop = (props: DesktopContainerProps) => {
  const { children } = props;
  const isDesktop = useMediaQuery({ minWidth: 992 })
  return isDesktop ? children : null
}


export default Desktop;
