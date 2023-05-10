import React from 'react';
import {Navigate} from "react-router-dom";
import jwtUtils from '../../utils/jwtUtils';

function PrivateRoutes(props) {
    const token = localStorage.getItem("accessToken");
    const {component: RouteComponent, path} = props;
    if(!jwtUtils.isAuth(token)){
        alert("로그인 필요");
        return <Navigate to={"/sign-in"} />;
    }
    return <RouteComponent />
}

export default PrivateRoutes;