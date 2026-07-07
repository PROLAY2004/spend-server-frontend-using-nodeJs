import { createBrowserRouter } from 'react-router-dom';

import Home from '../pages/home/Home.jsx';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Home />,
    },
    {
        path: '*',
        element: <h1>404 Not Found</h1>,
    },
]);

export default router;