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

export default function InfoDrawer() {

    const classes = useStyles();

    const { infoOpen, openInfo, closeInfo } = useNav();
    const { user } = useAuth();


    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        if (open) {
            openInfo();
        } else {
            closeInfo();
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
                <Grid item>
                    <Typography className={classes.paragraph} variant="body1">
                        FlyPaper is a collection of desktop wallpapers and screen shots for fans of flight simulators like MSFS or aviation in general.
                    </Typography>
                    <Typography className={classes.paragraph} variant="body1">
                        This site is free for you to use and enjoy with a few small guidelines.
                    </Typography>

                    <List className={classes.paragraph} aria-label="main mailbox folders">
                        <ListItem>
                            <CssListItemIcon>
                                <VerifiedUser />
                            </CssListItemIcon>
                            <CssListItemText
                                primary="Authenticate"
                                secondary="Login with a Twitch or Discord account" 
                            />
                        </ListItem>
                        <ListItem>
                            <CssListItemIcon>
                                <Copyright />
                            </CssListItemIcon>
                            <CssListItemText 
                                primary="Creative Commons"
                                secondary="Only submit your own images that can be shared publicly" 
                            />
                        </ListItem>
                    </List>
                    <Typography className={classes.paragraph} variant="body1">
                        Contact Kerkness on discord for suggestions or assistance. Enjoy!
                    </Typography>

                </Grid>
                {
                    (user && user.id) && <Grid item>
                    <Button
                        variant="contained"
                        color="default"
                        href="/logout"
                    >Logout</Button>
                </Grid>

                }
            </Grid>
        </div>
    );

    return (
        <div className={classes.root}>
            <React.Fragment>
                <Drawer anchor={'right'} open={infoOpen} onClose={toggleDrawer(false)}>
                    {list()}
                </Drawer>
            </React.Fragment>
        </div>
    );
}

