import { ElementsList } from '../pages/ElementsList';
import { MainLayout } from '../../../common/layouts/MainLayout';
import { RouteObject } from 'react-router-dom';

export const getDataSetRoutes = (isLoggedIn: boolean): RouteObject[] => {
  return [
    {
      path: 'data',
      element: <MainLayout />,
      children: [
        {
          path: ':datasetKey',
          element: <ElementsList />,
        }
      ]
    }
  ]
}