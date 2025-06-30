'use client';

import { useState, useEffect } from 'react';
import { NavDesktop } from './NavDesktop';
import NavMobile   from './NavMobile';
import NavBottom from '@/components/ui/Navbottom/NavBottom';
import { useSelector } from 'react-redux';

export default function NavCombined() {
  const [isMobile, setIsMobile] = useState(false);
  const info = useSelector((state) => state.companyInfo);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 772);
    };

    // Initial check
    handleResize();

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isMobile ? <NavMobile info={info.info}/> : <div><NavDesktop info={info.info}/> <NavBottom /></div>}
    </>
  );
}
