import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import PaperDetails from './PaperDetails';
import { buildURL } from 'react-imgix';
import useWindowSize from '../../components/useWindowSize';
import useDebounce from '../../components/useDebounce';

const useStyles = makeStyles({
    root: {
        backgroundColor: "#222222"
    },
    paperContainer: {
        flexGrow: 1,
        padding: 30
    }

});

/**
 * Conserve aspect ratio of the original region. Useful when shrinking/enlarging
 * images to fit into a certain area.
 *
 * @param {Number} srcWidth width of source image
 * @param {Number} srcHeight height of source image
 * @param {Number} maxWidth maximum available width
 * @param {Number} maxHeight maximum available height
 * @return {Object} { width, height }
 */
const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {

    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
}

const BackgroundPaper = (props) => {

    const [loaded, setLoaded] = useState(false);
    const classes = useStyles();
    const { paper } = props;

    const win = useWindowSize();
    const debouncedWin = useDebounce(win, 1000);

    const size = calculateAspectRatioFit(paper.width, paper.height, debouncedWin.width, debouncedWin.height);

    useEffect(() => {

        if (!isNaN(size.width) && !isNaN(size.height)) {
            setLoaded(true);
        }

    }, [debouncedWin, size]);

    const params = {
        w: debouncedWin.width,
    }

    const src = paper && paper.source ? buildURL(`https://${process.env.IMGIX_URL}/${paper.source}`, params) : '';

    const styles = {
        backgroundImage: `url(${src})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        width: debouncedWin.width,
        height: size.height
        // height
    };

    return (
        <Fragment>
            {loaded &&
                <div className={classes.root} style={styles}>
                    <Grid container
                        direction="column"
                        className={classes.paperContainer}
                        justifyContent="flex-end"
                        alignItems="flex-start"
                        style={{
                            width: '100vw',
                            height: size.height
                        }}
                    >
                        <PaperDetails paper={paper} />
                    </Grid>
                </div>
            }
        </Fragment>
    )

}

export default BackgroundPaper