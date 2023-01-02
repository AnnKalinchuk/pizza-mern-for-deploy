import React, { FC, ReactNode } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type TPrivateRouteProps = {
    children?: ReactNode,
    isAllowed: boolean
}


const PrivateRoute: FC<TPrivateRouteProps> = ({children, isAllowed}) => {
    const location = useLocation();

    if(!isAllowed) {
        window.alert('Sorry, you do not have access to the admin page')  
      
        return <Navigate to='/home' state={{from: location}}/>
    }
    
    return children ? children as JSX.Element : <Outlet/> /* as unknown */ ;
};

export default PrivateRoute;