import { createBrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import configaruration from '../config/config.js';
import ProtectedRoute from './ProtectedRoute.jsx';
import Home from '../pages/home/Home.jsx';
import Login from '../pages/login/Login.jsx';
import Dashboard from '../pages/dashboard/dashboard.jsx';
import Payers from '../pages/payers/Payers.jsx';

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
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        ),
    },
    {
        path: '/payers',
        element: (
            <ProtectedRoute>
                <Payers />
            </ProtectedRoute>
        ),
    },
    {
        path: '*',
        element: <h1>404 Not Found</h1>,
    },
]);

export default router;