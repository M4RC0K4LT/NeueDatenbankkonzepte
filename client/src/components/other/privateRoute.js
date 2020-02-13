import React from 'react';
import { Route, Redirect } from 'react-router-dom';
 
/** Checks if SessionToken is in Browser Storage -> manipulation would be detected on BackendServer */
const PrivateRoute = ({ ...props }) => {
    if (sessionStorage.getItem("authToken") != null){
      return (<Route { ...props } />);
    }else {
      return <Redirect to="/login" />
    }
}

/**
 * Protected Routes (Client Side).
 * @param {props} props - Properties given for Route Element
 * @return {Route} Chosen route or redirecting.
 */
export default PrivateRoute;