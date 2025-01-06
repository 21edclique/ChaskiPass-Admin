import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';


interface ProtectedRouteProps {
    requiredRole?: string[];
    children: JSX.Element;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    const { authUser } = useAuthContext();
    const [redirectPath, setRedirectPath] = useState<string | null>(null);

    // useEffect(() => {
    //     if (!authUser) {
    //         // Si el usuario no está autenticado, redirige al inicio de sesión
    //         setRedirectPath('/auth/signin');
    //     } else if (requiredRole && !requiredRole.includes(authUser.role)) {
    //         // Si no tiene permisos, muestra un mensaje y redirige
    //         toast.error('No tienes permisos para acceder a esta página');
    //         setRedirectPath('/');
    //     }
    // }, [authUser, requiredRole]);

    useEffect(() => {
        if (!authUser) {
          // Si el usuario no está autenticado, redirige al inicio de sesión
          setRedirectPath('/auth/signin');
        }
      }, [authUser]);
    
    if (redirectPath) {
        return <Navigate to={redirectPath} replace />;
    }

    // Si está autenticado y tiene el rol correcto, renderiza el componente hijo
    return <>{children}</>;
};

export default ProtectedRoute;
