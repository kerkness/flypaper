import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Box } from '@mui/material';
import PaperDetails from './PaperDetails';
import { buildURL } from 'react-imgix';
import useWindowSize from '../../components/useWindowSize';
import useDebounce from '../../components/useDebounce';
import Hidden from '@mui/material/Hidden';
import Stack from '@mui/material/Stack';
import { Image } from 'mui-image'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

const useStyles = makeStyles({
    root: {
        backgroundColor: "#222222"
    },
    paperContainer: {
        flexGrow: 1,
        padding: 0,
        // padding: 30
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

const TiledPaper = (props) => {

    const [loaded, setLoaded] = useState(false);
    const classes = useStyles();
    const { paper } = props;

    // const win = useWindowSize();
    // const debouncedWin = useDebounce(win, 1000);

    // const tileSize = { width: (debouncedWin.width / 4), height: (debouncedWin.height / 4) }

    // const size = calculateAspectRatioFit(paper.width, paper.height, tileSize.width, tileSize.height);

    // useEffect(() => {

    //     if (!isNaN(size.width) && !isNaN(size.height)) {
    //         setLoaded(true);
    //     }

    // }, [debouncedWin, size]);

    // const params = {
    //     w: tileSize.width,
    // }

    // const src = paper && paper.source ? buildURL(`https://${process.env.IMGIX_URL}/${paper.source}`, params) : '';

    return (
        <ImageListItem>
            {/* <Box  sx={{
            width: paper.scale.width,
            height: paper.scale.height
        }}> */}
           <Image
                fit="scale-down"
                src={paper.scaled_url}
                duration={500}
                showLoading
                // imageWidth={paper.scale.width}
                // imageHeight={paper.scale.height}
                width={paper.scale.width}
                heigth={paper.scale.height}
            />
            <ImageListItemBar position='below' title={paper.user.name} />
            {/* </Box> */}
        </ImageListItem>
    );

}

export default TiledPaper