import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

// Define the shape of the auth data
interface AuthData {
  firstName: string;
  lastName: string;
}

// Define the context value shape
interface AuthContextType {
  user: AuthData | null;
  login: (user: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: AuthData = {
  firstName: "John",
  lastName: "Doe",
};

export default function AuthProvider({
  children,
}: Readonly<PropsWithChildren>) {
  const [user, setUser] = useState<AuthData | null>(null);

  const login = (userData: AuthData = mockUser) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
