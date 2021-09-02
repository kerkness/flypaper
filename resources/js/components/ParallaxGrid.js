import React, { Fragment, useState, useRef, useEffect } from "react";
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";
import { buildURL } from 'react-imgix';
import useWindowSize from './useWindowSize';

const useStyles = makeStyles({
    container: {
        minHeight: '100vh',
        paddingTop: 175,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 150,
    },
})

const ParallaxGrid = (props) => {

    const classes = useStyles();
    const win = useWindowSize();
    const [src, setSrc] = useState('');
    const backgroundLoaded = useRef();

    useEffect(() => {
        backgroundLoaded.current = false;
        randomBackground();
    }, []);

    const randomBackground = () => {
        api.axiosGet('/api/paper/random', {
            limit: 1
        }).then(response => {
            console.log("random", response);
            if (response.data) {
                const paper = response.data[0];

                const params = {
                    h: win.height,
                }
                
                console.log("random paper", paper);
                const bg = paper && paper.source ? buildURL(`https://${process.env.IMGIX_URL}/${paper.source}`, params) : '';
                
                console.log("background", bg);
                setSrc(bg);
            }
            backgroundLoaded.current = true;
        }).catch(error => console.log(error));
    }

    const styles = {
        backgroundImage: `url(${src})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        width: win.width,
    };
    return (
        <Fragment>
            <Grid container
                spacing={2}
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
                className={classes.container}
                style={styles}
                {...props}
            >
                {props.children}
            </Grid>            
        </Fragment>

    )
}

export default ParallaxGrid;