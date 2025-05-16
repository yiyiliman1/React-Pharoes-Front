import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../../../common/layouts/MainLayout';
import { Home } from '../pages/Home'

export const getProjectRoutes = (isLoggedIn: boolean): RouteObject[] => {
  return [
    {
      path: '',
      element: <MainLayout withoutNavmenu />,
      children: [
        {
          path: '',
          element: <Home />
        }
      ]
    }
  ]
}