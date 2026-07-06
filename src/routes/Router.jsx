import { createBrowserRouter } from 'react-router-dom';

import Default from '../components/common/Default.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Default />,
    },
    {
        path: '/home',
        element: <Home />,
    },
    {
        path: '*',
        element: <h1>404 Not Found</h1>,
    },
]);

export default router;