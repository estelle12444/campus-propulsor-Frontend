// components/ModalContainer.tsx
'use client';

import { useModal } from '@/app/context/ModalContext';
import RegisterModal from './RegisterModal';
import LoginModal from './LoginModal';

export default function ModalContainer() {
  const { 
    isRegisterModalOpen, 
    isLoginModalOpen,
    closeRegisterModal, 
    closeLoginModal,
    openRegisterModal,
    openLoginModal
  } = useModal();
  
  return (
    <>
      <RegisterModal 
        isOpen={isRegisterModalOpen} 
        onClose={closeRegisterModal}
        onSwitchToLogin={openLoginModal}
      />
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal}
        onSwitchToRegister={openRegisterModal}
      />
    </>
  );
}