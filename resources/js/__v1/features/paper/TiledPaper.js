import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Button, Typography } from '@mui/material';
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
import Skeleton from '@mui/material/Skeleton';
import PaperDownload from "./PaperDownload";
import PaperLike from "./PaperLike";
import { useLightbox } from './lightbox/LightboxContextProvider';


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
    const { openPaper } = useLightbox();

    // console.log(paper.scaled_url, paper.scale.width);

    return (
        <ImageListItem>            
           <Image
                onClick={() => openPaper(paper)}
                sx={{
                    "&:hover": {
                        cursor: 'pointer'
                    }
                }}
                fit="scale-down"
                src={paper.scaled_url}
                duration={500}
                showLoading
                width={paper.scale.width}
                heigth={paper.scale.height}
                showLoading={<Skeleton variant="rectangular" width={paper.scale.width} height={paper.scale.height} />}
            />
            <ImageListItemBar 
                title={<Box
                    sx={{
                        display: 'flex'
                    }}
                >
                    <Typography 
                        variant="body1"
                        sx={{
                            flex: 1,
                            fontSize: 12,
                        }}
                    >
                        {paper.user.name}
                    </Typography>
                        <PaperLike paper={paper} small/>
                        <PaperDownload paper={paper} small/>

                </Box>} 
            />
        </ImageListItem>
    );

}

export default TiledPaper