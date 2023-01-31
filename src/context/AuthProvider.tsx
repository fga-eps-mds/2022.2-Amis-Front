/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { createContext, ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  getUserLocalStorage,
  LoginRequest,
  setUserLocalStorage,
} from "../services/auth";

interface Props {
  children?: ReactNode;
}

interface IUser {
  token?: string;
}

interface IAuthContext extends IUser {
  user: IUser | null;
  authenticate: (email: string, senha: string) => Promise<IUser>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider: React.FC = ({ children }: Props) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function authenticate(email: string, senha: string) {
    const response = await LoginRequest(email, senha);

    const payload = {
      token: response?.token,
      email: response?.email,
    };

    setUser(payload);
    setUserLocalStorage(payload);
    return response;
  }

  useEffect(() => {
    async function loadUser() {
      const userLocalStorage = await getUserLocalStorage();

      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (userLocalStorage) {
        setUser(userLocalStorage);
      }
      setLoading(false);
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadUser();
  }, []);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
