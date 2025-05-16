import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../../../common/layouts/MainLayout';
import { RunsProvider } from '../context/RunsContext';
import { RunDetailsPage } from '../pages/RunDetails';
import { RunsMainPage } from '../pages/RunsMain';
import { StartRunPage } from '../pages/StartRun';


export const getRunsRoutes = (isLoggedIn: boolean): RouteObject[] => {
  return [
    {
      path: 'runs',
      element: <MainLayout contextProviders={[ RunsProvider ]} />,
      children: [
        {
          path: '',
          element: <RunsMainPage />,
        },
        {
          path: 'start-run',
          element: <StartRunPage />,
        },
        {
          path: ':runId',
          element: <RunDetailsPage />,
        }
      ]
    }
  ]
}