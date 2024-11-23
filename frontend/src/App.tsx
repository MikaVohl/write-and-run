import { RouterProvider } from "react-router-dom";
import router from './providers/Router';
import { AuthProvider } from './contexts/AuthContext';
import { ReactQueryProvider } from "./providers/ReactQuery";

const LoadingScreen: React.FC = () => (
  <div className="flex flex-col justify-center items-center h-screen w-screen bg-neutral-100 dark:bg-neutral-900">
    <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
    <p className="mt-4 text-xl text-neutral-700 dark:text-neutral-300">Loading...</p>
  </div>
);

function App() {
  return (
    <ReactQueryProvider>
      <AuthProvider>
        <RouterProvider router={router} fallbackElement={<LoadingScreen />} />
      </AuthProvider>
    </ReactQueryProvider>
  );
}

export default App;