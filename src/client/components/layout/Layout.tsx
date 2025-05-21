'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';

import Footer from '@/client/components/layout/Footer';
import Header from '@/client/components/layout/Header';
import ResponsiveMenu from '@/client/components/layout/ReponsiveMenu';
import useMenuStore from '@/client/stores/menuStore';
import { BREAKPOINTS } from '@/utils/constants/screen';

export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  const { responsiveMenuState, setResponsiveMenuState } = useMenuStore();
  const responsiveMenuRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery({ maxWidth: BREAKPOINTS.S });

  useEffect(() => {
    const handleClickOutsideResponsiveMenu = (event: MouseEvent) => {
      if (
        responsiveMenuState &&
        responsiveMenuRef.current &&
        !responsiveMenuRef.current.contains(event.target as Node)
      ) {
        setResponsiveMenuState(!responsiveMenuState);
      }
    };

    document.addEventListener('mousedown', handleClickOutsideResponsiveMenu);

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutsideResponsiveMenu,
      );
    };
  });

  useEffect(() => {
    document.body.style.overflowY =
      responsiveMenuState && isMobile ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflowY = 'auto';
    };
  }, [responsiveMenuState, isMobile]);
  
  return (
    <>
      <Header />
      <ResponsiveMenu ref={responsiveMenuRef} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
