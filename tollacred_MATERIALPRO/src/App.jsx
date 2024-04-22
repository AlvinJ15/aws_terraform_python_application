import React, {Suspense, useEffect, useState} from 'react';
import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Themeroutes from './routes/Router';
import ThemeSelector from './layouts/theme/ThemeSelector';
import Loader from './layouts/loader/Loader';
import { Navigate } from 'react-router-dom';
import AuthRoutes from "./routes/RouterAuth.js";
import tokenExist from "@/config/AuthManager.js";
import authManager from "@/config/AuthManager.js";
import AuthManager from "@/config/AuthManager.js";

function App() {
  const routing = useRoutes(Themeroutes);
  const authRouting = useRoutes(AuthRoutes)
  const direction = useSelector((state) => state.customizer.isRTL);
  const isMode = useSelector((state) => state.customizer.isDark);

  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
        AuthManager.tokenExist().then(res => {
                setIsLoading(false);
                setIsLogged(res);
            }
        );
    }, []);

  return (
    <Suspense fallback={<Loader />}>
      <div
        className={`${direction ? 'rtl' : 'ltr'} ${isMode ? 'dark' : ''}`}
        dir={direction ? 'rtl' : 'ltr'}
      >
        <ThemeSelector />
        {
            isLoading ? (<p> Loading ... </p>) : (
                isLogged ? authRouting: routing
            )
        }
      </div>
    </Suspense>
  );
}

export default App
