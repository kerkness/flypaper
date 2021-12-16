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
}));


const DesktopDownloader = () => {

    const classes = useStyles();
    const [category, setCategory] = React.useState('featured');
    const [existingFiles, setExistingFiles] = React.useState([]);
    const [paddingTop, setPaddingTop] = React.useState(0);
    const [filesToSync, setFilesToSync] = React.useState([]);
    // const []

    const win = useWindowSize();
    const debouncedWin = useDebounce(win, 1000);

    let directory = undefined;

    React.useEffect(() => {
        if (debouncedWin.width < 920) {
            setPaddingTop(8)
        } else {
            setPaddingTop(0)
        }

    }, [debouncedWin])

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    }

    const onPathSelected = (dir, files) => {

        console.log("File Names", files);
        directory = dir;
        setExistingFiles(files);
        getFilesToSync(files);

    }

    const getFilesToSync = (files) => {
        window.api.axiosPost(`/api/paper/sync`, { files, category })
            .then(response => {
                syncFiles(response.data);
            })
            .catch(error => console.log("sync error", error));
    }

    const syncFiles = async(files) => {
        setFilesToSync(files);

        files.forEach(async(file) => {
            const params = {
                w: file.width,
                h: file.height,
            }

            const url = buildURL(`https://${process.env.IMGIX_URL}/${file.source}`, params);

            // await saveAs(url, file.filename);

            // window.api.axiosPost(`/api/paper/${file.id}/downloaded`)
            //     .then(response => console.log("download recorded", response))
            //     .catch(error => console.log("error", error));

        });


        // });
    }


    return <ParallaxGrid>
        <Box sx={{ mt: paddingTop }}>
            <Grid

                container
                direction='column'
                className={classes.root}
                spacing={2}
            >
                <Grid item>
                    <Typography variant="h4">FlyPaper Desktop</Typography>
                    <Typography variant="body1">These features are experimental and only supported by browsers which implement the latest File System Access API.</Typography>
                    <Typography variant="body1">Choose a category of FlyPaper you wish to sync locally and then select a directory to sync with.</Typography>
                </Grid>

                <Grid item>
                    <Select
                        value={category}
                        onChange={handleCategoryChange}
                        size='small'
                        sx={{ mr: 2 }}
                    >
                        <MenuItem value={'featured'}>Featured</MenuItem>
                        <MenuItem value={'likes'}>Your Likes</MenuItem>
                    </Select>
                    <SavePathButton category={category} onSelected={onPathSelected} />
                </Grid>

                {existingFiles.length > 0 && <Grid item>
                    <Typography>{`Found ${existingFiles.length} files at destination`}</Typography>
                </Grid>}
                {filesToSync.length > 0 && <Grid item>
                    <Typography>{`Found ${filesToSync.length} files to sync`}</Typography>
                </Grid>}

            </Grid>
        </Box>
    </ParallaxGrid>
}

export default DesktopDownloader;