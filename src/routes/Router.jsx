import { createBrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import configaruration from '../config/config.js';
import Home from '../pages/home/Home.jsx';
import Login from '../pages/login/Login.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    }, 
    {
        path: '/login',
        element: (
            <GoogleOAuthProvider clientId={configaruration.CLIENT_ID}>
                <Login />
            </GoogleOAuthProvider>
        ),
    },
    {
        path: '*',
        element: <h1>404 Not Found</h1>,
    },
]);

export default router;