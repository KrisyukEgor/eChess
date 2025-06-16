import { useCallback, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RoutesEnum } from "../../../shared/utils/RoutesEnum";
import { type User } from "../../../shared/types/User";
import { useFetch } from "../../../shared/hooks/useFetch";

import { config } from "../../../config/config";
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

const TOKEN_KEY = "token";

const LOGIN_PATH =  config.apiUrl + "/auth/login";
const REGISTER_PATH = config.apiUrl + "/auth/register";
const AUTH_ME_PATH = config.apiUrl + "/auth/me";

export default function useAuth() {
  const { loading: isLoading, error, request } = useFetch<AuthResponse>();

  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));

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

      } 
      catch (e) {
        setUser(null);
        setToken(null);

        console.log(e)

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

        console.log("login token", data.token);

        const redirectPath = RoutesEnum.HomeRoute;
        navigate(redirectPath, { replace: true });

        localStorage.setItem(TOKEN_KEY, data.token);
      } 
      catch (e) {
        console.log("login error", e);
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

        localStorage.setItem(TOKEN_KEY, data.token);
      } catch (e){
        console.log("register error", e)
      }
    },
    [request, navigate]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
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
