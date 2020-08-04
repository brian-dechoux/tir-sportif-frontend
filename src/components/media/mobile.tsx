import { useMediaQuery } from 'react-responsive';

type MobileProps = {
  children: any;
};

// FIXME Deprecated as there's a warning using useMediaQuery
const Mobile = (props: MobileProps) => {
  const { children } = props;
  const isMobile = useMediaQuery({ maxWidth: 991 })
  return isMobile ? children : null
}

export default Mobile;
