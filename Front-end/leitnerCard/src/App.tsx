import { RouterProvider } from 'react-router-dom';
import router from './components/Router';
import { UserProvider } from './components/userContext';

function App() {
  return (
    <>
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </>
  );
}

export default App;