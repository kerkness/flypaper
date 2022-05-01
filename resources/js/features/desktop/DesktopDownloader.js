import { Grid, Select, MenuItem, Typography, Button } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';
import React from 'react';
import ParallaxGrid from '../../components/ParallaxGrid';
import SavePathButton from './SavePathButton';
import useWindowSize from '../../components/useWindowSize';
import useDebounce from '../../components/useDebounce';
import { Box } from '@mui/system';
import { buildURL } from 'react-imgix';


const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: 'rgb(22,22,22,0.5)',
        width: '100%',
        padding: theme.spacing(2),
        color: '#FFF'
    },
    link: {
        textDecoration: 'none',
        color: '#F1F1F1',
    },

}));


const DesktopDownloader = () => {

    const classes = useStyles();
    const [paddingTop, setPaddingTop] = React.useState(0);

    const win = useWindowSize();
    const debouncedWin = useDebounce(win, 1000);

    React.useEffect(() => {
        if (debouncedWin.width < 920) {
            setPaddingTop(2)
        } else {
            setPaddingTop(0)
        }

    }, [debouncedWin])

    return <ParallaxGrid>
        <Box sx={{ 
            width: '100%', 
            // mt: paddingTop, 
            display: 'flex', 
            justifyContent: 'space-evenly' 
        }}>

            <Box sx={{
                flex: 1,
                p: 2, 
                backgroundColor: '#222', 
                color: '#FFF'
            }}>
                <Typography variant='h1' sx={{ fontSize: '32px'}}>FlyTrap - Windows Wallpaper Client</Typography>

                <Typography sx={{ p:1 }}>
                    FlyTrap is a small windows tray application that updates your desktop wallpaper/background from the FlyPaper database.
                    Select a FlyPaper category, search term or creator and automatically rotate your wallpaper on a schedule.

                </Typography>
                <Typography sx={{ p:1 }}>
                    FlyPaper and FlyTrap are free and come with no warrante or guarantee. Join <a className={classes.link} target="_blank" href='https://discord.gg/ZpGTDWfrxW'>TheFlyingFabio</a> discord for suggestions and/or assistance. Enjoy!
                </Typography>



                <Box sx={{ m: 2 }}>
                <img src="/flytrap-screenshot.png" />
                </Box>


                <Box sx={{ p: 2 }}>
                    <Button variant='contained' onClick={() => { window.location = 'https://theflyingfabio.com/tff-resource/flytrap/'}}>Download FlyTrap</Button>
                </Box>
            </Box>

        </Box>
    </ParallaxGrid>
}

export default DesktopDownloader;