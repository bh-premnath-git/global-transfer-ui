import { Sun, Moon, LogIn, UserPlus, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/hooks/useAuth";
import { APP_NAME } from "@/constants";

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <span className="text-xl font-bold text-foreground">{APP_NAME}</span>
      </div>

      {/* Auth and Theme Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-8 w-8 p-0"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => logout()}
              className="h-8 px-2 text-sm"
            >
              Logout
            </Button>
          </div>
        ) : (
          <>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-sm">
              <LogIn className="h-4 w-4 mr-1" />
              Sign In
            </Button>
            <Button variant="outline" size="sm" className="h-8 px-2 text-sm">
              <UserPlus className="h-4 w-4 mr-1" />
              Sign Up
            </Button>
          </>
        )}
      </div>
    </header>
  );
};