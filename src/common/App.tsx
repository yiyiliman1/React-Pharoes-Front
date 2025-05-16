import { QueryClient, QueryClientProvider } from 'react-query';
import { useRoutes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { useAuthToken } from '../modules/Auth/hooks/useAuthToken';
import { getRoutes } from './config/router';
import { NavigationProvider } from './context/NavigationContext';

import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false }
  }
});


function App() {
  const { hasActiveSession } = useAuthToken()
  const isLoggedIn = hasActiveSession();
  const routerComponent = useRoutes(getRoutes(isLoggedIn));
  
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationProvider>
        <div className="App">
          <ToastContainer position='bottom-right' />
          {routerComponent}
        </div>
      </NavigationProvider>
    </QueryClientProvider>
  )
}

export default App
