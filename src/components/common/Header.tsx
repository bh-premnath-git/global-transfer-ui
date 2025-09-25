import { Link } from "react-router-dom";
import { Sun, Moon, LogIn, UserPlus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/constants";
import { useAuthDialog } from "@/providers/AuthDialogProvider";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const { openAuth } = useAuthDialog();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-3 sm:px-4 lg:px-6">
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-full px-1.5 py-0.5 transition-colors hover:bg-primary/10"
          aria-label={`${APP_NAME} home`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 shadow-inner">
            <Building2 className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight text-foreground">{APP_NAME}</span>
            <span className="text-xs text-muted-foreground">Global transfers</span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative rounded-full border-border/60 bg-background/80 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5 h-8 w-8"
            aria-label="Toggle theme"
          >
            <Sun className="h-3.5 w-3.5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-3.5 w-3.5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 rounded-full border border-border/60 bg-card/80 px-2.5 py-1 shadow-sm backdrop-blur">
              <div className="hidden text-right sm:block">
                <span className="block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Welcome</span>
                <span className="block text-xs font-semibold text-foreground">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="h-7 rounded-full px-3 text-xs font-medium hover:bg-primary/10"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 rounded-full px-3 text-xs font-medium transition-colors hover:bg-primary/10"
                onClick={() => openAuth("login")}
              >
                <LogIn className="mr-1.5 h-3.5 w-3.5" />
                Sign In
              </Button>
              <Button
                variant="gradient"
                size="sm"
                className="h-8 rounded-full px-3 text-xs font-medium shadow-lg shadow-primary/20"
                onClick={() => openAuth("register")}
              >
                <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};