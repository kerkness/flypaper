import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { useNav } from '../nav/navSlice';
import { Typography } from '@mui/material';
import { useAuth } from '../admin/authSlice';
import CustomDrawer from '../../components/CustomDrawer';


const useStyles = makeStyles({
    root: {
    },
    list: {
        flexGrow: 1,
    },
    link: {
        textDecoration: 'none',
        color: '#F1F1F1',
    },
    grid: {
        minHeight: '100%',
        color: '#FFFFFF',
        padding: '40px',
    },
    paragraph: {
        color: '#FFFFFF',
        marginBottom: 20
    },
});

export default function AccountDrawer() {

    const classes = useStyles();

    const { account, toggleDrawer } = useNav();
    const { user } = useAuth();

    console.log("Art we installed?", window.getDisplayMode());

    const list = () => (
        <div
            className={clsx(classes.list)}
            role="presentation"
            onClick={() => toggleDrawer('account', false)}
            onKeyDown={() => toggleDrawer('account', false)}
        >
            <Grid container
                className={classes.grid}
                spacing={3}
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <Grid item>
                    <Typography className={classes.paragraph} variant="body1">
                        Welcome {user.name}
                    </Typography>
                    <Typography className={classes.paragraph} variant="body1">
                        Join <a className={classes.link} target="_blank" href='https://discord.gg/ZpGTDWfrxW'>TheFlyingFabio</a> discord for suggestions and/or assistance. Enjoy!
                    </Typography>

                </Grid>
                <Grid item>
                    <Button variant="contained" href="/logout">Logout</Button>
                </Grid>
            </Grid>
        </div>
    );

    return (
        <div className={classes.root}>
            <React.Fragment>
                <CustomDrawer anchor={'right'} open={account} onClose={() => toggleDrawer('account', false)}>
                    {list()}
                </CustomDrawer>
            </React.Fragment>
        </div>
    );
}

