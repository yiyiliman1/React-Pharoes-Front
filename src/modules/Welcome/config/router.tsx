import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../../../common/layouts/MainLayout';
import { WelcomeMain } from '../pages/Main';

export const getWelcomeRoutes = (isLoggedIn: boolean): RouteObject[] => {
  return [
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: '',
          element: <WelcomeMain />
        }
      ]
    }
  ]
}