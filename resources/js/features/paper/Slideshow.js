import React, { Fragment, useState, useRef, useEffect } from "react";
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Hidden, BottomNavigation, BottomNavigationAction, Fade } from "@material-ui/core";
import PauseIcon from '@material-ui/icons/Pause';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import TimerIcon from '@material-ui/icons/Timer';
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPrevIcon from '@material-ui/icons/SkipPrevious';
import PaperDetails from "./PaperDetails";
import { useHistory } from "react-router-dom";
import { usePaper } from "./paperSlice";
import useWindowSize from "../../components/useWindowSize";
import { buildURL } from 'react-imgix';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { usePaperLoader } from "./PaperLoader";

const useStyles = makeStyles({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        minHeight: '100vh',
        paddingTop: 40,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 150,
    },
    loading: {
        minHeight: '100vh',
        minWidth: '100vw',
    },
    bottomNavigation: {
        width: '100vw',
        position: 'fixed',
        bottom: 0,
        backgroundColor: 'rgba(20, 20, 20, .5)',
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

});

const timerOptions = [
    {label: '5 seconds', time: 5},
    {label: '10 seconds', time: 10},
    {label: '20 seconds', time: 20},
    {label: '30 seconds', time: 30},
    {label: '40 seconds', time: 40},
    {label: '50 seconds', time: 50},
    {label: '60 seconds', time: 60},
];

const PaperSlide = (props) => {

    const { paper } = props;
    const classes = useStyles();
    const win = useWindowSize();
    const [src, setSrc] = useState('');

    useEffect(() => {
        if (paper && paper.id) {
            const params = {
                h: win.height,
            }

            const bg = paper && paper.source ? buildURL(`https://${process.env.IMGIX_URL}/${paper.source}`, params) : '';
            setSrc(bg);
        }
    }, [paper]);

    const styles = {
        backgroundImage: `url(${src})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        width: win.width,
        animation: 'fade 3s infinite',
    };


    return (
            <Grid container
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                className={classes.container}
                style={styles}
            >
                <Fragment>
                    <Hidden xsDown>
                        <PaperDetails paper={paper} />
                    </Hidden>
                </Fragment>
            </Grid>
    )
}

const Slideshow = (props) => {

    const classes = useStyles();
    const history = useHistory();
    const { papers, hasNextPage } = usePaper();
    const { loadPaper } = usePaperLoader();
    const [current, setCurrent] = useState(0);
    const [delay, setDelay] = useState(5);
    const [play, setPlay] = useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    let intervalRef = useRef();

    useEffect(() => {
        if (!papers.length) {
            history.push('/');
        }
    }, [])

    useEffect(() => {

        if ( (current + 2) >= papers.length && hasNextPage ) {
            console.log("near end.. load more");
            loadPaper();
        }

        const timer = setTimeout(() => {
            console.log("timer", current, papers.length)
            if (play && current < (papers.length-1)) {
                setCurrent(current+1);
            }
            if (play && current === (papers.length-1)) {
                setCurrent(0);
            }
        }, delay * 1000); 

        return () => clearTimeout(timer)

    }, [current, play])

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Fragment>
            {
                papers.map((paper, index) => <Fade 
                    in={current === index ? true : false} 
                    key={index}
                    timeout={1800}
                >
                    <div>
                        <PaperSlide paper={paper} />
                    </div>
                </Fade>)
            }
            <BottomNavigation className={classes.bottomNavigation}>
                <BottomNavigationAction
                    disabled={current === 0}
                    className={classes.iconbutton}
                    label="Previous"
                    icon={<SkipPrevIcon />}
                    onClick={() => setCurrent(current-1)}
                />
                <BottomNavigationAction
                    onClick={() => setPlay(!play)}
                    className={classes.iconbutton}
                    label={play ? 'Pause' : 'Play'}
                    icon={play ? <PauseIcon /> : <PlayArrowIcon />}
                />
                <BottomNavigationAction
                    className={classes.iconbutton}
                    label="Stop"
                    icon={<StopIcon />}
                    onClick={() => history.push('/')}
                />

                <BottomNavigationAction
                    className={classes.iconbutton}
                    label="Timer"
                    icon={<TimerIcon />}
                    onClick={handleClick}
                />

                <BottomNavigationAction
                    disabled={current === (papers.length - 1)}
                    className={classes.iconbutton}
                    label="Next"
                    icon={<SkipNextIcon />}
                    onClick={() => setCurrent(current+1)}
                />
            </BottomNavigation>

            <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    // keepMounted
                    open={open}
                    onClose={handleClose}
                >
                    {timerOptions.map((option, index) => (
                        <MenuItem key={index} selected={option.time === delay} onClick={() => {
                            setDelay(option.time)
                            handleClose();
                        }}>
                            {option.label}
                        </MenuItem>
                    ))}
                </Menu>

        </Fragment>

    )
}

export default Slideshow;