import { createBrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import configaruration from '../config/config.js';
import ProtectedRoute from './ProtectedRoute.jsx';
import Home from '../pages/home/Home.jsx';
import Login from '../pages/login/Login.jsx';
import Dashboard from '../pages/dashboard/Dashboard.jsx';
import Payers from '../pages/payers/Payers.jsx';
import Invoices from '../pages/invoices/Invoices.jsx';
import Ledgers from '../pages/ledger/Ledgers.jsx';
import PublicInvoice from '../pages/public_invoice/PublicInvoice.jsx';

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
        path: '/invoice/:token',
        element: <PublicInvoice />
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
        path: '/invoices',
        element: (
            <ProtectedRoute>
                <Invoices/>
            </ProtectedRoute>
        )
    },
    {
        path: '/ledgers',
        element: (
            <ProtectedRoute>
                <Ledgers />
            </ProtectedRoute>
        )
    },
    {
        path: '*',
        element: <h1>404 Not Found</h1>,
    },
]);

export default router;