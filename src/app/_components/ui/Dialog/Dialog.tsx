import { Modal, ModalProps } from 'antd';
import React, { useState } from 'react';

interface DialogProps extends ModalProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  footer: React.ReactNode;
  colorType?: string;
  className?: string;
}

const Dialog = ({
  children,
  trigger,
  footer,
  colorType,
  className,
  ...props
}: DialogProps) => {
  const dialogClass = `dialog dialog--${colorType ?? ''} ${className ?? ''}`;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div onClick={showModal}>{trigger}</div>
      <Modal
        className={dialogClass}
        open={isModalOpen}
        onOk={handleOk}
        footer={<div onClick={handleOk}>{footer}</div>}
        {...props}
      >
        {children}
      </Modal>
    </>
  );
};

export default Dialog;
