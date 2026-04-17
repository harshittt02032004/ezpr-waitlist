"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import WaitlistModal from "./WaitlistModal";

type WaitlistContextValue = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const WaitlistContext = createContext<WaitlistContextValue | null>(null);

export function useWaitlist(): WaitlistContextValue {
  const ctx = useContext(WaitlistContext);
  if (!ctx) {
    throw new Error("useWaitlist must be used inside <WaitlistProvider>");
  }
  return ctx;
}

export default function WaitlistProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ open, close, isOpen }), [open, close, isOpen]);

  return (
    <WaitlistContext.Provider value={value}>
      {children}
      <WaitlistModal open={isOpen} onClose={close} />
    </WaitlistContext.Provider>
  );
}
