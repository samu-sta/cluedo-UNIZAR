import { useState, useEffect } from 'react';
import useIsMobile from '../../common/hooks/useIsMobile';

const useHeader = () => {
  const isMobile = useIsMobile()
  const [ismenuOpened, setismenuOpened] = useState(false)

  useEffect(() => {
    if (!isMobile) {
      setismenuOpened(false)
    }
  }, [isMobile])

  const toggleMenu = () => {
    setismenuOpened(!ismenuOpened)
  };

  const navClasses =
    `header-main-nav ${isMobile ? 'mobile' : ''} ${ismenuOpened && isMobile ? 'open' : ''}`
  const navListClasses = `header-nav-list ${isMobile ? 'mobile' : ''}`

  return {
    isMobile,
    toggleMenu,
    ismenuOpened,
    navClasses,
    navListClasses
  };
}

export default useHeader;