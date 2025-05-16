import { RouteObject } from 'react-router-dom';
import { MainLayout } from '../../../common/layouts/MainLayout';
import { ProfilesProvider } from '../context/ProfilesContext';
import { ProfilesMain } from '../pages/ProfilesMain';


export const getProfilesRoutes = (isLoggedIn: boolean): RouteObject[] => {
  return [
    {
      path: 'profiles',
      element: <MainLayout contextProviders={[ ProfilesProvider ]} />,
      children: [
        {
          path: '',
          element: <ProfilesMain />,
        }
      ]
    }
  ]
}