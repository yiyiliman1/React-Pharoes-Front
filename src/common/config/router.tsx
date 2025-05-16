import { Navigate, Outlet, RouteObject } from 'react-router-dom';
import { getProjectRoutes } from '../../modules/Projects/config/router';
import { getDataSetRoutes } from '../../modules/Dataset/config/router';
import { getAuthRoutes } from '../../modules/Auth/config/router';
import { ProjectPaths } from '../../modules/Projects/config/paths';
import { AuthPaths } from '../../modules/Auth/config/paths';
import { getWelcomeRoutes } from '../../modules/Welcome/config/router';
import { getConsumptionRoutes } from '../../modules/Consumption/config/router';
import { getAllExecutionsRoutes } from '../../modules/AccountRuns/config/router';
import { getProfilesRoutes } from '../../modules/Profiles/config/router';
import { getRunsRoutes } from '../../modules/Runs/config/router';


export const getRoutes = (isLoggedIn: boolean): RouteObject[] => {
  return [
    {
      path: "/",
      
      children: [
        {
          path: "app",
          element: isLoggedIn ? <Outlet /> : <Navigate to={AuthPaths.Signin} replace />,
          children: [
            ...getProjectRoutes(isLoggedIn),
            ...getConsumptionRoutes(isLoggedIn),
            ...getAllExecutionsRoutes(isLoggedIn),
            {
              path: "project/:projectId",
              children: [
                ...getDataSetRoutes(isLoggedIn),
                ...getWelcomeRoutes(isLoggedIn),
                ...getProfilesRoutes(isLoggedIn),
                ...getRunsRoutes(isLoggedIn),
              ]
            },
            { path: "", element: <Navigate to={ProjectPaths.Main} replace /> }
          ]
          
        },
        {
          path: "auth",
          children: getAuthRoutes(isLoggedIn)
        },
        { path: "", element: <Navigate to="/app" replace /> }
      ]
    }
  ] as RouteObject[]
}