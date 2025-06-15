import { useCallback, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../../shared/utils/RoutesEnum";
import { User } from "../../../shared/types/User";
import { useFetch } from "../../../shared/hooks/useFetch";

type LoginData = {
  email: string;
  password: string;
};
type RegisterData = LoginData & {
  userName: string;
};

type AuthResponse = {
  user: User;
  token: string;
};

const LOGIN_PATH = "http://localhost:5000/auth/login";
const REGISTER_PATH = "http://localhost:5000/auth/register";
const AUTH_ME_PATH = "http://localhost:5000/auth/me";

export default function useAuth() {
  const { loading: isLoading, error, request } = useFetch<AuthResponse>();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuth() {
      try {
        const data = await request({
          url: AUTH_ME_PATH,
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data.user);
        setToken(data.token);
      } 
      catch {
        setUser(null);
        setToken(null);
      }
    }
    checkAuth();
  }, [request, token]);

  const login = useCallback(
    async (credentials: LoginData) => {
      try {
        const data = await request({
          url: LOGIN_PATH,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        setUser(data.user);
        setToken(data.token);

        const redirectPath =(location.state as any)?.from?.pathname || RoutesEnum.HomeRoute;
        navigate(redirectPath, { replace: true });
      } catch (e) {
        // error already set by useFetch
      }
    },
    [request, location, navigate]
  );

  const register = useCallback(
    async (credentials: RegisterData) => {
      try {
        const data = await request({
          url: REGISTER_PATH,
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        setUser(data.user);
        setToken(data.token);

        navigate(RoutesEnum.HomeRoute, { replace: true });
      } catch {
        // error already set
      }
    },
    [request, navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setUser(null);
    setToken(null);
    navigate(RoutesEnum.HomeRoute);
  }, [navigate]);

  return {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
  };
}
