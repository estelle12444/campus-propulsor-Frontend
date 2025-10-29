// context/ModalContext.tsx
'use client';

import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  isRegisterModalOpen: boolean;
  isLoginModalOpen: boolean;
  openRegisterModal: () => void;
  openLoginModal: () => void;
  closeRegisterModal: () => void;
  closeLoginModal: () => void;
  closeAllModals: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const openRegisterModal = () => {
    setIsLoginModalOpen(false);
    setIsRegisterModalOpen(true);
  };

  const openLoginModal = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const closeRegisterModal = () => setIsRegisterModalOpen(false);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const closeAllModals = () => {
    setIsRegisterModalOpen(false);
    setIsLoginModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ 
      isRegisterModalOpen, 
      isLoginModalOpen,
      openRegisterModal, 
      openLoginModal,
      closeRegisterModal, 
      closeLoginModal,
      closeAllModals
    }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}