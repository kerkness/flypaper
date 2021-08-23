import React, { useEffect } from "react";
import {
    HashRouter as Router,
} from "react-router-dom";
import FlyPaperNavigation from "./features/nav/Navigation";
import PaperRoutes from "./features/nav/Routes";
import { useAuth } from "./features/admin/authSlice";


const FlyPaperApp = (props) => {

    const { setUser, setToken } = useAuth();

    useEffect(() => {
        if (props.user !== null) {
            setUser(JSON.parse(props.user));
            setToken(props.token);

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