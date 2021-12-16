import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@mui/styles';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import { useNav } from '../nav/navSlice';
import { Typography } from '@mui/material';
import CustomDrawer from '../../components/CustomDrawer';

const useStyles = makeStyles({
    paragraph: {
        color: '#FFFFFF',
        margin: 20,
    },
    list: {
        flexGrow: 1,
        // width: 450,
        // overflow: "hidden",
        // backgroundColor: 'rgba(60,80,90,0.9)'
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

    const { login, toggleDrawer, drawerOpen } = useNav();

    const list = () => (
        <div
            className={clsx(classes.list)}
            role="presentation"
            onClick={() => toggleDrawer('login', false)}
            onKeyDown={() => toggleDrawer('login', false)}
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
                    <Button variant="contained" href="/auth/discord/redirect">Login Discord</Button>
                </Grid>
                <Grid item>
                    <Button variant="contained" href="/auth/twitch/redirect">Login Twitch</Button>
                </Grid>
            </Grid>
        </div>
    );

    return (
        <div className={classes.root}>
            <React.Fragment>
                <CustomDrawer anchor={'right'} open={login} onClose={() => toggleDrawer('login', false)}>
                    {list()}
                </CustomDrawer>
            </React.Fragment>
        </div>
    );
}

