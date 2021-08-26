import React, { useEffect } from "react";
import {
    HashRouter as Router,
} from "react-router-dom";
import FlyPaperNavigation from "./features/nav/Navigation";
import PaperRoutes from "./features/nav/Routes";
import { useAuth } from "./features/admin/authSlice";


const FlyPaperApp = (props) => {

    const { setUser, setToken, setRoles } = useAuth();

    console.log(props);

    useEffect(() => {
        if (props.token) {
            setUser(JSON.parse(props.user));
            setToken(props.token);

            window.api.axiosGet('/api/user', {}, props.token).then(response => {
                setRoles(response.data.roles);
            });
            // window.api.axiosGet('/sanctum/csrf-cookie').then(response => {
            //     // console.log("got them cookies", response);
            // });
        }
    }, [])

    return (
        <Router>
            <FlyPaperNavigation />
            <PaperRoutes />
        </Router>
    )
}

export default FlyPaperApp;