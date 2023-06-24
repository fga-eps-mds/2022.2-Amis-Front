/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { createContext, ReactNode, useState } from "react";
import {
  getUserLocalStorage,
  LoginRequest,
  setUserLocalStorage,
} from "../services/auth";

interface Props {
  children?: ReactNode;
}

export type Roles = "socialWorker" | "student" | "teacher" | "supervisor";
interface IUser {
  token?: string;
  role?: Roles;
  email?: string;
}

interface IAuthContext extends IUser {
  user: IUser | null;
  authenticate: (email: string, senha: string, role: Roles) => Promise<IUser>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

// eslint-disable-next-line react/prop-types
const AuthProvider: React.FC<Props> = ({ children }) => {
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState<IUser | null>(() => {
    const userLocalStorage = getUserLocalStorage();
    setLoading(false);
    return userLocalStorage || null;
  });

  async function authenticate(email: string, senha: string, rolee: Roles) {
    const response = await LoginRequest(email, senha, rolee);

    const payload = {
      token: response?.token,
      role: rolee,
      email: response?.email,
    };

    setUser(payload);
    setUserLocalStorage(payload);
    return payload;
  }

  function logout() {
    setUser(null);
    setUserLocalStorage("");
  }

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        authenticate,
        logout,
        loading,
        role: user?.role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
