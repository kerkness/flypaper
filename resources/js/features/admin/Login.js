import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import { useNav } from '../nav/navSlice';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles({
    paragraph: {
        color: '#FFFFFF',
        margin: 20,
    },
    list: {
        flexGrow: 1,
        width: 450,
        overflow: "hidden",
        backgroundColor: 'rgba(60,80,90,0.9)'
    },
    grid: {
        minHeight: '100%',
    },
});

const CssIconButton = withStyles({
    root: {
        color: '#FFFFFF'
    },
    colorSecondary: {
        color: 'hotpink'
    }
})(IconButton);

export default function LoginDrawer() {

    const classes = useStyles();

    const { loginOpen, openLogin, closeLogin } = useNav();


    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        if (open) {
            openLogin();
        } else {
            closeLogin();
        }
    };

    const list = () => (
        <div
            className={clsx(classes.list)}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <Grid container
                className={classes.grid}
                spacing={3}
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <CssIconButton size="medium">
                    <VerifiedUser />
                </CssIconButton>
                <Typography className={classes.paragraph} variant="body1">
                    Verify yourself to continue
                </Typography>

                <Grid item>
                    <Button
                        variant="contained"
                        color="default"
                        href="/auth/discord/redirect"
                    >Login Discord</Button>
                </Grid>
                <Grid item>
                    <Button
                        variant="contained"
                        color="default"
                        href="/auth/twitch/redirect"
                    >Login Twitch</Button>
                </Grid>
            </Grid>
        </div>
    );

    return (
        <div className={classes.root}>
            <React.Fragment>
                <Drawer anchor={'right'} open={loginOpen} onClose={toggleDrawer(false)}>
                    {list()}
                </Drawer>
            </React.Fragment>
        </div>
    );
}
