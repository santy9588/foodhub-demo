import { createContext, useContext, type ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface AuthContextType {
  isAuthenticated: boolean;
  principal: string | null;
  login: () => void;
  logout: () => void;
  isLoggingIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const principal = isAuthenticated ? identity!.getPrincipal().toString() : null;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        principal,
        login,
        logout: clear,
        isLoggingIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
