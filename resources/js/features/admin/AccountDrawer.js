import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { useNav } from '../nav/navSlice';
import { Typography } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { useAuth } from '../admin/authSlice';
import CustomDrawer from '../../components/CustomDrawer';
import { Link } from "react-router-dom";


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
                    <Button
                        variant="contained"
                        color="default"
                        href="/logout"
                    >Logout</Button>
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

