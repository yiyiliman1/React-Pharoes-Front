import { RouteObject } from 'react-router-dom';
import { Logout } from '../pages/Logout';
import { Signin } from '../pages/Signin'
import { SigninCallback } from '../pages/SigninCallback';
import { AuthRelativePaths } from './paths';


export const getAuthRoutes = (isLoggedIn: boolean): RouteObject[] => {
  return [
    {
      path: AuthRelativePaths.Signin,
      element: <Signin />,
    },
    {
      path: AuthRelativePaths.Logout,
      element: <Logout />,
    },
    {
      path: AuthRelativePaths.SigninCallback,
      element: <SigninCallback />,
    }
  ]
}