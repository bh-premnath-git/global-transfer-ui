import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { AuthDialog, AuthMode } from "@/components/auth/AuthDialog";

interface AuthDialogContextValue {
  openAuth: (mode?: AuthMode) => void;
  closeAuth: () => void;
}

const AuthDialogContext = createContext<AuthDialogContextValue | undefined>(undefined);

interface AuthDialogProviderProps {
  children: ReactNode;
}

export const AuthDialogProvider = ({ children }: AuthDialogProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");

  const openAuth = useCallback((nextMode: AuthMode = "login") => {
    setMode(nextMode);
    setIsOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      openAuth,
      closeAuth,
    }),
    [openAuth, closeAuth]
  );

  return (
    <AuthDialogContext.Provider value={value}>
      {children}
      <AuthDialog open={isOpen} mode={mode} onOpenChange={setIsOpen} onModeChange={setMode} />
    </AuthDialogContext.Provider>
  );
};

export const useAuthDialog = () => {
  const context = useContext(AuthDialogContext);

  if (!context) {
    throw new Error("useAuthDialog must be used within an AuthDialogProvider");
  }

  return context;
};
