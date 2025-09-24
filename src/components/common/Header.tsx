import { Link } from "react-router-dom";
import { Sun, Moon, LogIn, UserPlus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/constants";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="group flex items-center gap-3 rounded-full px-2 py-1 transition-colors hover:bg-primary/10"
          aria-label={`${APP_NAME} home`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 shadow-inner">
            <Building2 className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-tight text-foreground">{APP_NAME}</span>
            <span className="text-xs text-muted-foreground">Global transfers, simplified</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative rounded-full border-border/60 bg-background/80 shadow-sm transition-colors hover:border-primary/50 hover:bg-primary/5"
            aria-label="Toggle theme"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 rounded-full border border-border/60 bg-card/80 px-3 py-1.5 shadow-sm backdrop-blur">
              <div className="hidden text-right sm:block">
                <span className="block text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Welcome</span>
                <span className="block text-sm font-semibold text-foreground">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="h-8 rounded-full px-4 text-xs font-semibold uppercase tracking-wide hover:bg-primary/10"
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 rounded-full px-4 text-sm font-medium transition-colors hover:bg-primary/10"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <Button
                variant="gradient"
                size="sm"
                className="h-9 rounded-full px-4 text-sm font-semibold shadow-lg shadow-primary/20"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};