import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../../../common/layouts/MainLayout';
import { ConsumptionMain } from '../pages/Main';


export const getConsumptionRoutes = (isLoggedIn: boolean): RouteObject[] => {
  return [
    {
      path: 'consumption',
      element: <MainLayout withoutNavmenu />,
      children: [
        { path: '', element: <ConsumptionMain /> }
      ]
    },
  ]
}