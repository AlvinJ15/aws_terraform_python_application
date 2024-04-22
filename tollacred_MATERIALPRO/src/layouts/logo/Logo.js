import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import React from 'react';
import { ReactComponent as LogoDarkIcon } from '../../assets/images/logos/dark-logo-icon.svg';
//import { ReactComponent as LogoDarkText } from '../../assets/images/logos/dark-logo-text.svg';
import { ReactComponent as LogoDarkText } from '../../assets/images/logos/mini_logo.svg';
import { ReactComponent as LogoWhiteIcon } from '../../assets/images/logos/white-logo-icon.svg';
//import { ReactComponent as LogoWhiteText } from '../../assets/images/logos/white-logo-text.svg';
import { ReactComponent as LogoWhiteText } from '../../assets/images/logos/mini_logo.svg';
import { ReactComponent as LogoWhithText } from '../../assets/images/logos/logo_tollanis.svg';

const Logo = () => {
  const isDarkMode = useSelector((state) => state.customizer.isDark);
  const toggleMiniSidebar = useSelector((state) => state.customizer.isMiniSidebar);
  const activeTopbarBg = useSelector((state) => state.customizer.topbarBg);
  return (
    <Link to="/" className="d-flex align-items-center gap-2 mando">
      {/* {isDarkMode || activeTopbarBg !== 'white' ? (
        <>
          <LogoWhiteIcon />
          {toggleMiniSidebar ? '' : <LogoWhiteText />}
        </>
      ) : (
        <>
          <LogoDarkIcon />
          {toggleMiniSidebar ? '' : <LogoDarkText />}
        </>
      )} */}
      {/* until we have dark and white logo*/}
      <LogoWhithText width={111} height={20} />
    </Link>
  );
};

export default Logo;
