import React, { useState } from "react";
import { alpha, makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, Button, ButtonGroup, IconButton } from "@material-ui/core";
import LoginDrawer from "../admin/Login";
import Fade from '@material-ui/core/Fade';
import InfoIcon from '@material-ui/icons/Info';
import ImageSearchIcon from "@material-ui/icons/ImageSearch";
import { useAuth } from "../admin/authSlice";
import { useNav } from "../nav/navSlice";
import SubmitPaper from "../submit/SubmitPaper";
import InfoDrawer from "../browser/InfoDrawer";
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import InputBase from '@material-ui/core/InputBase';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';


const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    appbar: {
        backgroundColor: 'rgba(20, 20, 20, .5)',
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        // flex: 2,
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
    catButtons: {
        marginLeft: 20,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

const FlyPaperNavigation = (props) => {

    const [showFilter, setShowFilter] = useState(false)
    const classes = useStyles();
    const { user } = useAuth();
    const { openLogin, openSubmit, openInfo, infoOpen } = useNav();


    const toggleSubmit = (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        if (!user.id) {
            openLogin();
        }
        else {
            openSubmit();
        }
    };

    const toggleInfo = (event) => {
        openInfo();
    }

    return (
        <div className={classes.grow}>
            <AppBar position="fixed" className={classes.appbar}>
                <Toolbar>
                    <Typography onClick={() => window.location.href = '/'} variant="h6" className={classes.title}>
                        FlyPaper
                        {
                            (user && user.id) && <span className={classes.name}>
                                Hi {user.name}
                            </span>
                        }
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
                </Toolbar>

                {showFilter &&
                    <Fade
                        in={showFilter}
                        style={{
                            transitionDelay: showFilter ? '100ms' : '0ms',
                        }}
                    // unmountOnExit
                    >

                        <Toolbar>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search Tags…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>

                            <ButtonGroup
                                className={classes.catButtons}
                                disableElevation
                                variant="contained"
                                color="default"
                            >
                                <Button>Most Popular</Button>
                                <Button>Most Downloaded</Button>
                            </ButtonGroup>

                            <ButtonGroup
                                className={classes.catButtons}
                                disableElevation
                                variant="contained"
                                color="default"
                            >
                                <Button>All Tags</Button>
                                <Button>Creators</Button>
                            </ButtonGroup>

                            <Typography className={classes.spacer} variant="body1">
                                &nbsp;&nbsp;&nbsp;&nbsp;( Filters and Searching Not Implemented Yet )
                            </Typography>
                            <IconButton
                            onClick={() => setShowFilter(!showFilter)}
                            color="inherit"
                            className={classes.iconbutton}
                        >
                            <CloseIcon />
                        </IconButton>
                        </Toolbar>
                    </Fade>
                }

            </AppBar>
            <LoginDrawer />
            <SubmitPaper imgServer={props.imgServer} />
            <InfoDrawer />
        </div>
    )
}

export default FlyPaperNavigation;