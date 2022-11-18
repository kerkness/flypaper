import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { Image } from 'mui-image'
import { useLightbox } from './LightboxContextProvider';
import { IconButton, useTheme, Skeleton, Typography, CircularProgress } from '@mui/material';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import PaperDownload from "../PaperDownload";
import PaperLike from "../PaperLike";
import { TagLink, SearchLink } from "../PaperDetails";
// import PaperImage from '../../../components/Image/PaperImage';
import { alpha } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import useWindowSize from '../../../components/useWindowSize';
import useDebounce from '../../../components/useDebounce';
import { buildURL } from 'react-imgix';
import { categories, usePaper } from "../paperSlice";
import { displayByteSize } from "../../../components/useFileSizeConverter";


// import { saveAs } from 'paper-saver';
// import {CopyToClipboard} from 'react-copy-to-clipboard';
// import { useNotice } from '../../notice/NoticeContext';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vw',
    bgcolor: 'background.paper',
    boxShadow: 24,
};

const navButton = {
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    borderRadius: 20,
    boxShadow: 24,
}

const prevNav = {
    left: 50,
}

const nextNav = {
    right: 10,
}


const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {

    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth * ratio, height: srcHeight * ratio };
}

export default function PaperLightboxModal() {

    const { open, onClose, prevPaper, nextPaper, currentPaper } = useLightbox();
    const theme = useTheme();
    const [src, setSrc] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [loaded, setLoaded] = React.useState(false);
    const win = useWindowSize();
    const debouncedWin = useDebounce(win, 1000);
    const maxSize = { width: debouncedWin.width * 0.8, height: debouncedWin.height * 0.7 }
    // let maxWidth = win.width * 0.8;
    // let maxHeight = win.height * 0.7;
    const [lastRatio, setLastRatio] = React.useState({ width: maxSize.width, height: maxSize.height });
    // const {showSuccess} = useNotice();

    const width = currentPaper && currentPaper.meta && currentPaper.meta.width ? currentPaper.meta.width : '';
    const height = currentPaper && currentPaper.meta && currentPaper.meta.height ? currentPaper.meta.height : '';
    const dimensions = currentPaper && width && height && currentPaper.type === 'image' ? ` - (${width} x ${height} px)` : ''

    // if (width && width < maxSize.width) {
    //     maxSize.width = width;
    // }
    // if (height && height < maxSize.height) {
    //     maxSize.height = height;
    // }


    React.useEffect(() => {

        if (!isNaN(maxSize.width) && !isNaN(maxSize.height)) {
            setLoaded(true);
        }

    }, [debouncedWin, maxSize]);

    React.useEffect(() => {

        if (currentPaper && loaded) {

            const w = currentPaper && currentPaper.meta && currentPaper.meta.width ? currentPaper.meta.width : win.width;
            const h = currentPaper && currentPaper.meta && currentPaper.meta.height ? currentPaper.meta.height : win.height;

            const ratio = calculateAspectRatioFit(w, h, maxSize.width, maxSize.height);


            const params = {
                w: maxSize.width,
                h: maxSize.height,
                // fit: 'fill'
            }

            const url = currentPaper && currentPaper.source ? buildURL(`https://${process.env.IMGIX_URL}/${currentPaper.source}`, params) : '';

            if (url) {
                setSrc(url);
                setLoading(false);
                setLastRatio(ratio);
            }

        }

    }, [currentPaper, loaded])

    const categoryLabel = (slug) => {
        const cat = _.find(categories, c => c.slug === slug);
        return cat ? cat.label : slug;
    }


    return (
        <Modal
            open={open}
            onClose={onClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
                sx: { backgroundColor: alpha(theme.palette.background.paper, 0.9) }
            }}>
            <Fade in={open}>
                <Box>{loaded && <Box sx={{ maxHeight: '100%' }}>
                    <Box sx={{ ...navButton, ...prevNav }}><IconButton onClick={() => {
                        setLoading(true);
                        prevPaper();
                    }}><KeyboardArrowLeftIcon /></IconButton></Box>
                    {loading && <Box sx={style}><Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: maxSize.height,
                            width: maxSize.width,
                        }}
                    >

                        <CircularProgress />
                    </Box></Box>}
                    {(currentPaper && !loading) && <Box sx={style}>
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center', 
                            ...lastRatio.height > maxSize.height ? { height: '100%'} : {}
                        }}>
                            {(currentPaper && src) && <Image
                                sx={{
                                    "&:hover": {
                                        cursor: 'pointer'
                                    },
                                }}

                                fit="scale-down"
                                src={src}
                                duration={200}
                                showLoading
                                width={maxSize.width}
                                height={maxSize.height}
                                showLoading={<Skeleton variant="rectangular" width={lastRatio.width || 0} height={lastRatio.height || 0} />}
                            />}
                        </Box>
                        {currentPaper && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Box sx={{ p: 0.5, flex: 1, color: '#FFF' }}>

                                <Typography variant="body2">
                                     {currentPaper.user.name}
                                    &nbsp;| {categoryLabel(currentPaper.category)}
                                    &nbsp;| {displayByteSize(currentPaper.size)}
                                    {
                                        !currentPaper.approved && <span>&nbsp;| Private</span>
                                    }
                                </Typography>

                            </Box>
                            <Box sx={{ pr: 0.5 }}>
                                <PaperLike paper={currentPaper} />
                                <PaperDownload paper={currentPaper} />
                            </Box>
                        </Box>}
                    </Box>}
                    <Box sx={{ ...navButton, ...nextNav }}>
                        <IconButton onClick={() => {
                            setLoading(true);
                            nextPaper();
                        }}><KeyboardArrowRightIcon /></IconButton>
                    </Box>
                </Box>}</Box>
            </Fade>
        </Modal>
    );
}