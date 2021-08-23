import React, { useEffect } from "react";
import clsx from 'clsx';
import Imgix, { Background, ImgixProvider, buildURL } from 'react-imgix';
import { makeStyles } from '@material-ui/core/styles';
import {
    HashRouter as Router,
} from "react-router-dom";
import FlyPaperNavigation from "./features/nav/Navigation";
import PaperRoutes from "./features/nav/Routes";
import { useAuth } from "./features/admin/authSlice";
import { Parallax } from "react-parallax";
import { usePaper } from "./features/browser/paperSlice";


const useStyles = makeStyles({
    root: {
        minHeight: "100vh",
        backgroundColor: "#222222"
    },
});

const FlyPaperApp = (props) => {

    const classes = useStyles();
    const { setUser } = useAuth();
    const { papers, addPapers } = usePaper();

    useEffect(() => {
        if (props.user !== null) {
            setUser(JSON.parse(props.user));

            window.api.axiosGet('/sanctum/csrf-cookie').then(response => {
                // console.log("got them cookies", response);
            });
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