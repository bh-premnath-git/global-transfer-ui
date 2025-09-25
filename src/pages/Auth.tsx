import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/constants";

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ name: "", email: "", password: "" });

  const {
    login,
    register: registerUser,
    isLoggingIn,
    isRegistering,
    isAuthenticated,
    error,
    clearError,
  } = useAuth();

  const mode = searchParams.get("mode") === "register" ? "register" : "login";
  const isRegisterMode = mode === "register";
  const isSubmitting = isRegisterMode ? isRegistering : isLoggingIn;

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleModeChange = (nextMode: "login" | "register") => {
    if (nextMode === mode) {
      return;
    }

    const params = new URLSearchParams(searchParams);
    params.set("mode", nextMode);
    setSearchParams(params, { replace: true });
    setFormValues((prev) => ({ ...prev, password: "" }));
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

  return (
    <section className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-muted/20 px-4 py-12">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-semibold">{heading}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-center gap-2">
            <Button
              type="button"
              variant={isRegisterMode ? "outline" : "gradient"}
              size="sm"
              onClick={() => handleModeChange("login")}
              disabled={isSubmitting}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={isRegisterMode ? "gradient" : "outline"}
              size="sm"
              onClick={() => handleModeChange("register")}
              disabled={isSubmitting}
            >
              Sign Up
            </Button>
          </div>

          {error ? (
            <Alert variant="destructive" className="mb-4">
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
                  onChange={(event) => setFormValues((prev) => ({ ...prev, name: event.target.value }))}
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
                onChange={(event) => setFormValues((prev) => ({ ...prev, email: event.target.value }))}
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
                onChange={(event) => setFormValues((prev) => ({ ...prev, password: event.target.value }))}
                disabled={isSubmitting}
                minLength={6}
                required
              />
            </div>

            <Button type="submit" className="w-full" variant="gradient" disabled={isSubmitting}>
              {isSubmitting ? "Please wait..." : isRegisterMode ? "Create account" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};

export default Auth;
