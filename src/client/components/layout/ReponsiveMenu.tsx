'use client';

import { forwardRef } from 'react';

import '@/client/styles/components/layout/responsive-menu.scss';

import useMenuStore from '@/client/stores/menuStore';

const ResponsiveMenu = forwardRef<HTMLDivElement, { className?: string }>(
  ({ className }, ref) => {
    const { responsiveMenuState, setResponsiveMenuState } = useMenuStore();

    const handleOnClickCloseMenu = () => {
      setResponsiveMenuState(!responsiveMenuState);
    };

    return (
      <div
        ref={ref}
        className={`responsive-menu ${className ?? ''} ${responsiveMenuState ? 'show' : 'hide'}`}
      ></div>
    );
  },
);

export default ResponsiveMenu;
