import { useAuthToken } from "../hooks/useAuthToken";

const AUTH_URL = import.meta.env.VITE_AUTH_URL;
const COGNITO_ID = import.meta.env.VITE_COGNITO_ID;

export const Signin = () => {
  const { removeToken } = useAuthToken();
  const redirectUri = `${window.location.origin}/auth/signin/callback`;
  const url = `${AUTH_URL}/oauth2/authorize?response_type=code&client_id=${COGNITO_ID}&redirect_uri=${redirectUri}`;
  removeToken();
  window.location.href = url;
  return <></>;
};
