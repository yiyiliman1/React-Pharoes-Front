import { useEffect, useState } from "react";
import { useAuthToken } from "../hooks/useAuthToken";
import { COOKIES } from "../../../common/config/cookies";
import { useCookies } from "react-cookie";

export const SigninCallback = () => {
  const { getTokens } = useAuthToken();
  const [cookies] = useCookies();
  const [rawCode, setRawCode] = useState<any>(null);

  useEffect(() => {
    if (!cookies[COOKIES.Token]) {
      const url = new URL(window.location.href.replace("#", "?"));
      const code = url.searchParams.get("code");
      setRawCode(code);
    } else {
      setRawCode(cookies[COOKIES.Token]);
    }
  }, [cookies]);

  useEffect(() => {
    if (rawCode) {
      getTokens(rawCode);
    }
  }, [rawCode]);

  return <></>;
};
