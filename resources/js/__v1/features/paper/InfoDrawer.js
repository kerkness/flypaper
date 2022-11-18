import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import { useNav } from '../nav/navSlice';
import { Typography } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VerifiedUser from '@mui/icons-material/VerifiedUser';
import Copyright from '@mui/icons-material/Copyright';
import CustomDrawer from '../../components/CustomDrawer';
import { Link, useLocation } from "react-router-dom";


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

export default function InfoDrawer() {

    const classes = useStyles();
    const { info, toggleDrawer } = useNav();
    const location = useLocation();

    const gotoDiscord = () => {
        console.log(`https://discord.gg/ZpGTDWfrxW`);
    }

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
                        Join <a className={classes.link} target="_blank" href='https://discord.gg/ZpGTDWfrxW'>TheFlyingFabio</a> discord for suggestions and/or assistance. Enjoy!
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

