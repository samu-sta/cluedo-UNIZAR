import { useState, useEffect } from 'react';

const IS_MOBILE_WIDTH = 800;

const useIsMobile = (width = IS_MOBILE_WIDTH) => {
  const [isMobile, setIsMobile] = useState(false);
  const handleResize = () => {
    setIsMobile(window.innerWidth < width);
  };
  useEffect(() => {

    handleResize();

    window.addEventListener('load', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleResize);
    };
  }, []);

  return isMobile;
};

export default useIsMobile;