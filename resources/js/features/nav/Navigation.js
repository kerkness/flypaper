import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography } from "@material-ui/core";
import LoginDrawer from "../admin/Login";
import Fade from '@material-ui/core/Fade';
import InfoIcon from '@material-ui/icons/Info';
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import { useAuth } from "../admin/authSlice";
import { useNav } from "../nav/navSlice";
import SubmitPaper from "../submit/SubmitPaper";
import InfoDrawer from "../paper/InfoDrawer";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import AccountIcon from '@material-ui/icons/AccountCircle';
import IconButton from '../../components/IconButton';
import AccountDrawer from "../admin/AccountDrawer";
import FilterBar from "./FilterBar";
import { useHistory } from "react-router-dom";


const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    appbar: {
        backgroundColor: 'rgba(20, 20, 20, .5)',
    },
    title: {
        cursor: "pointer",
        color: "#ffffff"
    },
    spacer: {
        flexGrow: 1,
        flex: 2,
    },
    name: {
        marginLeft: "20px",
        fontSize: "12px",
    },
    iconbutton: {
        color: '#ffffff'
    },
}));

const FlyPaperNavigation = (props) => {

    const [showFilter, setShowFilter] = useState(false)
    const classes = useStyles();
    const { user } = useAuth();
    const { toggleDrawer } = useNav();
    const history = useHistory();


    const toggleSubmit = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        if (!user.id) {
            toggleDrawer('login', true);
            // openLogin();
        }
        else {
            toggleDrawer('submit', true);
            // openSubmit();
        }
    };

    const toggleInfo = (event) => {
        toggleDrawer('info', true);
        // openInfo();
    }

    const toggleAccount = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        if (!user.id) {
            toggleDrawer('login', true);
            // openLogin();
        }
        else {
            toggleDrawer('account', true);
            // openSubmit();
        }
    };


    return (
        <div className={classes.grow}>
            <AppBar position="fixed" className={classes.appbar}>
                <Toolbar>
                    <Typography onClick={() => history.push('/')} variant="h6" className={classes.title}>
                        FlyPaper <span className={classes.name}>
                        BETA
                        </span>
                    </Typography>
                    <Typography className={classes.spacer}></Typography>
                    <IconButton
                        onClick={() => setShowFilter(!showFilter)}
                        color="inherit"
                        className={classes.iconbutton}
                    >
                        <ImageSearchIcon />
                    </IconButton>
                    <IconButton
                        onClick={toggleSubmit}
                        color="inherit"
                        className={classes.iconbutton}
                    >
                        <AddPhotoAlternateIcon />
                    </IconButton>
                    <IconButton
                        onClick={toggleInfo}
                        aria-label="info"
                        className={classes.iconbutton}
                    >
                        <InfoIcon />
                    </IconButton>
                    <IconButton
                        onClick={toggleAccount}
                        aria-label="info"
                        className={classes.iconbutton}
                    >
                        <AccountIcon />
                    </IconButton>
                </Toolbar>

                {showFilter &&
                    <Fade
                        in={showFilter}
                        style={{
                            transitionDelay: showFilter ? '100ms' : '0ms',
                        }}
                    >
                        <div>
                            <FilterBar onClose={() => setShowFilter(false)}/>
                        </div>
                    </Fade>
                }

            </AppBar>
            <LoginDrawer />
            <SubmitPaper />
            <InfoDrawer />
            <AccountDrawer />
        </div>
    )
}

export default FlyPaperNavigation;