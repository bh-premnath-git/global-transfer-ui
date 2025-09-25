import { FormEvent, useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/constants";

export type AuthMode = "login" | "register";

interface AuthDialogProps {
  open: boolean;
  mode: AuthMode;
  onOpenChange: (open: boolean) => void;
  onModeChange: (mode: AuthMode) => void;
}

const INITIAL_VALUES = {
  name: "",
  email: "",
  password: "",
};

export const AuthDialog = ({ open, mode, onOpenChange, onModeChange }: AuthDialogProps) => {
  const [formValues, setFormValues] = useState(INITIAL_VALUES);
  const {
    login,
    register: registerUser,
    isLoggingIn,
    isRegistering,
    isAuthenticated,
    error,
    clearError,
  } = useAuth();

  const isRegisterMode = mode === "register";
  const isSubmitting = isRegisterMode ? isRegistering : isLoggingIn;

  useEffect(() => {
    if (isAuthenticated && open) {
      onOpenChange(false);
    }
  }, [isAuthenticated, open, onOpenChange]);

  useEffect(() => {
    if (!open) {
      setFormValues(INITIAL_VALUES);
      if (error) {
        clearError();
      }
      if (mode !== "login") {
        onModeChange("login");
      }
    }
  }, [open, error, clearError, mode, onModeChange]);

  const heading = useMemo(
    () => (isRegisterMode ? "Create your account" : "Welcome back"),
    [isRegisterMode]
  );

  const description = useMemo(
    () =>
      isRegisterMode
        ? `Join ${APP_NAME} to send money worldwide in minutes.`
        : "Sign in to manage transfers and recipients.",
    [isRegisterMode]
  );

  const handleModeChange = (nextMode: AuthMode) => {
    if (nextMode === mode) {
      return;
    }

    onModeChange(nextMode);
    setFormValues((prev) => ({
      ...prev,
      password: "",
      ...(nextMode === "login" ? { name: "" } : {}),
    }));
    clearError();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isRegisterMode) {
      registerUser({
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
      });
      return;
    }

    login({
      email: formValues.email.trim(),
      password: formValues.password,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border border-border/60 bg-background/95 p-0 shadow-2xl">
        <div className="flex flex-col gap-6 p-6">
          <DialogHeader className="space-y-1 text-center">
            <DialogTitle className="text-2xl font-semibold tracking-tight">{heading}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center gap-2 rounded-full border border-border/60 bg-muted/40 p-1">
            <Button
              type="button"
              variant={isRegisterMode ? "ghost" : "gradient"}
              size="sm"
              className="h-8 rounded-full px-4 text-xs font-medium"
              onClick={() => handleModeChange("login")}
              disabled={isSubmitting}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={isRegisterMode ? "gradient" : "ghost"}
              size="sm"
              className="h-8 rounded-full px-4 text-xs font-medium"
              onClick={() => handleModeChange("register")}
              disabled={isSubmitting}
            >
              Sign Up
            </Button>
          </div>

          {error ? (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isRegisterMode ? (
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  placeholder="Jane Doe"
                  value={formValues.name}
                  onChange={(event) =>
                    setFormValues((prev) => ({ ...prev, name: event.target.value }))
                  }
                  disabled={isSubmitting}
                  required
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formValues.email}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, email: event.target.value }))
                }
                disabled={isSubmitting}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formValues.password}
                onChange={(event) =>
                  setFormValues((prev) => ({ ...prev, password: event.target.value }))
                }
                disabled={isSubmitting}
                minLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" variant="gradient" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : isRegisterMode ? "Create account" : "Sign in"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
