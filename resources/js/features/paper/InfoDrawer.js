import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import { useNav } from '../nav/navSlice';
import { Typography } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import Copyright from '@material-ui/icons/Copyright';
import CustomDrawer from '../../components/CustomDrawer';

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
    const { info, toggleDrawer } = useNav();

    const list = () => (
        <div
            className={clsx(classes.list)}
            role="presentation"
            onClick={() => toggleDrawer('info', false)}
            onKeyDown={() => toggleDrawer('info', false)}
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
            </Grid>
        </div>
    );

    return (
        <div className={classes.root}>
            <React.Fragment>
                <CustomDrawer anchor={'right'} open={info} onClose={() => toggleDrawer('info', false)}>
                    {list()}
                </CustomDrawer>
            </React.Fragment>
        </div>
    );
}

