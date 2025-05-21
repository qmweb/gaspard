'use client';

import '@/client/styles/components/layout/header.scss';

import useMenuStore from '@/client/stores/menuStore';

const Header = () => {
  const { setResponsiveMenuState } = useMenuStore();

  const handleOnClickOpenMenu = () => {
    setResponsiveMenuState(true);
  };

  return <header className='header'></header>;
};

export default Header;
