import { Navigate } from 'react-router-dom';
import isAuthenticated from '../utils/checkAuth.js';

const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated()) {
        localStorage.setItem('postLoginRedirect', location.pathname);
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;