import { useCookies } from "react-cookie";
import jwtDecode from "jwt-decode";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { COOKIES } from "../../../common/config/cookies";
import { AuthPaths } from "../config/paths";
import axios, { AxiosRequestConfig } from "axios";
import { API } from "../../../common/services/api";

type DecodedToken = { exp: number; username: string };

type PublicAuthToken = {
  handleSetIdToken: (token: string) => void;
  removeToken: () => void;
  hasActiveSession: () => boolean;
  getTokens: (code: string) => void;
  expGlobal: number;
  handleTokenRefresh: () => void;
  IdToken: any;
};

interface AuthTokenState {
  token: DecodedToken;
  expiration: Dayjs;
  expMs: number;
}

export const useAuthToken = (): PublicAuthToken => {
  const navigate = useNavigate();
  let expGlobal = -1;
  const [cookies, setCookie, removeCookie] = useCookies();
  const [IdToken, setIdToken] = useState<AuthTokenState | undefined>(undefined);
  const AUTH_URL = import.meta.env.VITE_AUTH_URL;
  const COGNITO_ID = import.meta.env.VITE_COGNITO_ID;
  const rawToken = cookies[COOKIES.Token];
  const rawRefresh = cookies[COOKIES.Refresh];

  useEffect(() => {
    setIdToken(!rawToken ? undefined : buildStateForRawToken(rawToken));
  }, [rawToken]);

  const handleTokenRefresh = async () => {
    const url = `${AUTH_URL}/oauth2/token?grant_type=refresh_token&client_id=${COGNITO_ID}&refresh_token=${rawRefresh}`;
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    await axios
      .post(url, {}, config)
      .then((response) => {
        const tokens: any = response.data;
        if (tokens) {
          handleSetIdToken(tokens.id_token);
        }
      })
      .catch((err) => {
        removeToken();
        navigate(AuthPaths.Signin);
      });
  };

  let tokenExpTime: any = null;

  useEffect(() => {
    if (IdToken && IdToken.expMs) {
      tokenExpTime = setTimeout(handleTokenRefresh, IdToken.expMs - 10000);
    }

    return () => {
      clearTimeout(tokenExpTime);
    };
  }, [IdToken]);

  function buildStateForRawToken(rawToken: string): AuthTokenState {
    const token = jwtDecode<DecodedToken>(rawToken);
    const expiration = dayjs(token.exp * 1000).subtract(5, "seconds");
    const expMs = expiration.diff(dayjs());
    return { token, expMs, expiration };
  }

  const getTokens = async (code: string) => {
    if (!rawToken) {
      const url = `${AUTH_URL}/oauth2/token?grant_type=authorization_code&code=${code}&client_id=${COGNITO_ID}&redirect_uri=${window.location.origin}/auth/signin/callback`;
      const config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: {},
      };
      const response = await API.call("POST", url, false, config);
      const tokens: any = response.data;
      if (tokens) {
        handleSetIdToken(tokens.id_token);
        handleSetRefreshToken(tokens.refresh_token);
      }
      navigate("/");
    } else {
      handleSetIdToken(rawToken);
      handleSetRefreshToken(rawRefresh);
      navigate("/");
    }
  };

  function handleSetIdToken(rawToken: string): void {
    setCookie(COOKIES.Token, rawToken, { path: "/" });
    setIdToken(buildStateForRawToken(rawToken));
  }

  function handleSetRefreshToken(rawToken: string): void {
    setCookie(COOKIES.Refresh, rawToken, { path: "/" });
  }

  function removeToken(): void {
    removeCookie(COOKIES.Token, { path: "/" });
    setIdToken(undefined);
  }

  function checkTokenExpiration() {
    return !!IdToken && dayjs().isBefore(IdToken.expiration);
  }

  function hasActiveSession(): boolean {
    return checkTokenExpiration();
  }

  return {
    handleSetIdToken,
    hasActiveSession,
    removeToken,
    getTokens,
    expGlobal,
    handleTokenRefresh,
    IdToken,
  };
};
