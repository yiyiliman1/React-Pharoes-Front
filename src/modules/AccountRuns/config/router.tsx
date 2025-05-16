import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../../../common/layouts/MainLayout';
import { AllExecutionMain } from '../pages/Main';


export const getAllExecutionsRoutes = (isLoggedIn: boolean): RouteObject[] => {
  return [
    {
      path: 'all-runs',
      element: <MainLayout withoutNavmenu />,
      children: [
        { path: '', element: <AllExecutionMain /> }
      ]
    },
  ]
}