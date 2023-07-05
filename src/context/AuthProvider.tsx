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
  email?: string;
}

export type Roles = "socialWorker" | "student" | "teacher" | "supervisor";
interface IAuthContext extends IUser {
  user: IUser | null;
  authenticate: (email: string, senha: string, role: Roles) => Promise<IUser>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  role?: Roles;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

// eslint-disable-next-line react/prop-types
const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<Roles | undefined>(undefined);

  async function authenticate(email: string, senha: string, role2: Roles) {
    console.log({ email, senha });
    const response = await LoginRequest(email, senha, role2);

    const payload = {
      role: role2,
      token: response?.token,
      email,
    };

    setRole(role2);
    setUser(payload);
    setUserLocalStorage(payload);
    return response;
  }

  useEffect(() => {
    async function loadUser() {
      const userLocalStorage = await getUserLocalStorage();

      setRole(userLocalStorage.role);
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
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
