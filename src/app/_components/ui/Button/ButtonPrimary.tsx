import React from 'react';

import '@/styles/ui/button/primary.scss';

interface ButtonPrimaryProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  colorType?: string;
  url?: string;
  className?: string;
}

const ButtonPrimary = ({
  children,
  colorType,
  className,
  ...props
}: ButtonPrimaryProps) => {
  const buttonClassName = `button-primary button-primary--${colorType ?? ''} ${className ?? ''}`;

  return (
    <button type='button' className={buttonClassName} {...props}>
      {children}
    </button>
  );
};

export default ButtonPrimary;
