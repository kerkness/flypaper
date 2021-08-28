import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { useNav } from '../nav/navSlice';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import Copyright from '@material-ui/icons/Copyright';
import { useAuth } from '../admin/authSlice';

const CssListItemText = withStyles({
    primary: {
        color: '#FFFFFF'
    },
    secondary: {
        color: '#EEEEEE'
    }
})(ListItemText);

const CssListItemIcon = withStyles({
    root: {
        color: '#FFFFFF'
    },
})(ListItemIcon);


const useStyles = makeStyles({
    root: {
    },
    list: {
        flexGrow: 1,
        width: 450,
        overflow: "hidden",
        backgroundColor: 'rgba(60,80,90,0.9)'
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
                        Contact Kerkness on discord for suggestions or assistance. Enjoy!
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
                <Drawer anchor={'right'} open={account} onClose={() => toggleDrawer('account', false)}>
                    {list()}
                </Drawer>
            </React.Fragment>
        </div>
    );
}

