import React, { useState } from "react";
import clsx from "clsx";
import { makeStyles } from '@mui/styles';
import { AppBar, Toolbar, Typography } from "@mui/material";
import LoginDrawer from "../admin/Login";
import Fade from '@mui/material/Fade';
import InfoIcon from '@mui/icons-material/Info';
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import ImageSearchTwoToneIcon from '@mui/icons-material/ImageSearchTwoTone';
import Slideshow from '@mui/icons-material/Slideshow';
import { useAuth } from "../admin/authSlice";
import { useNav } from "../nav/navSlice";
import SubmitPaper from "../submit/SubmitPaper";
import InfoDrawer from "../paper/InfoDrawer";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AccountIcon from '@mui/icons-material/AccountCircle';
import IconButton from '../../components/IconButton';
import AccountDrawer from "../admin/AccountDrawer";
import FilterBar from "./FilterBar";
import { useHistory, useLocation } from "react-router-dom";
import { usePaper } from "../paper/paperSlice";
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import TableRowsIcon from '@mui/icons-material/TableRows';
import queryString from 'query-string';


const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    appbar: {
        backgroundColor: 'rgb(20, 20, 20, 0.5)',
        // backgroundColor: 'pink',
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
    iconbuttonActive: {
        backgroundColor: 'rgba(50,50,50,0.7)',
        '&:hover': {
            backgroundColor: 'rgba(90,90,90,0.5)',
        }
    }
}));

const FlyPaperNavigation = (props) => {

    const { toggleDrawer, showFilter, setShowFilter } = useNav();
    // const [showFilter, setShowFilter] = useState(false)
    const { papers, toggleMosaic, mosaic } = usePaper();
    const classes = useStyles();
    const { user } = useAuth();
    const history = useHistory();
    const location = useLocation();


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

    const showGrid = () => {
        pushWithQuery({
            ...getParams(),
            'grid': 1
        })
    }
    const hideGrid = () => {
        const params = getParams();
        delete params['grid'];

        pushWithQuery({
            ...params,
        })
    }

    const getParams = () => {
        return queryString.parse(location.search);
    }

    const pushWithQuery = (params) => {
        console.log("push with", params);
        history.push(params ? `/?${queryString.stringify(params)}` : `/`)
    }

    const params = queryString.parse(location.search);
    const hasGrid = params.grid ? true : false;

    // console.log("QWuery Params ", params, location);

    return (
        <div className={classes.grow}>
            { location.pathname !== '/play' && 
            <AppBar position="fixed" className={classes.appbar}>
                <Toolbar>
                    <Typography onClick={() => history.push('/')} variant="h6" className={classes.title}>
                        FlyPaper 
                    </Typography>
                    <Typography className={classes.spacer}></Typography>
                    <IconButton
                        onClick={() => hasGrid ? hideGrid() : showGrid()}
                    >
                        {hasGrid ? <TableRowsIcon /> : <AutoAwesomeMosaicIcon />}
                    </IconButton>
                    <IconButton
                        onClick={() => setShowFilter(!showFilter)}
                        color="inherit"
                        className={clsx({
                            [classes.iconbutton]: true,
                            [classes.iconbuttonActive]: showFilter,
                        })}
                        size="large">
                        { showFilter ? <ImageSearchTwoToneIcon /> : <ImageSearchIcon />}
                    </IconButton>
                    {papers.length > 0 && <IconButton
                        disabled={papers.length < 1}
                        onClick={() => history.push('/play')}
                        size="large">
                        <Slideshow />
                    </IconButton>}
                    <IconButton
                        onClick={toggleSubmit}
                        color="inherit"
                        className={classes.iconbutton}
                        size="large">
                        <AddPhotoAlternateIcon />
                    </IconButton>
                    <IconButton
                        onClick={toggleInfo}
                        aria-label="info"
                        className={classes.iconbutton}
                        size="large">
                        <InfoIcon />
                    </IconButton>
                    <IconButton
                        onClick={toggleAccount}
                        aria-label="info"
                        className={classes.iconbutton}
                        size="large">
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
            }
            <LoginDrawer />
            <SubmitPaper />
            <InfoDrawer />
            <AccountDrawer />
        </div>
    );
}

export default FlyPaperNavigation;