import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import {
    Grid,
    Typography,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
} from "@material-ui/core";
import { saveAs } from 'file-saver';
import FileDownloadIcon from '@material-ui/icons/GetApp';
import { useAuth } from '../admin/authSlice';
import { useNav } from '../nav/navSlice';
import InputTextField from '../../components/InputTextField';
import IconButton from '../../components/IconButton';
import { usePaper } from './paperSlice';
import { buildURL } from 'react-imgix';


const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
    label: {
        color: '#FFFFFF'
    },
    disabled: {
        color: '#555555',
    },
    inputContainer: {
        width: '100px'
    },
    downloadButton: {
        marginTop: '20px'
    }
}));

const CssPopOver = withStyles({
    paper: {
        backgroundColor: '#333333',
        padding: 40,
    }
})(Popover)

const CssRadio = withStyles({
    colorSecondary: {
        color: '#FFFFFF',
        '&$checked': {
            color: 'hotpink',
        },
    },
    checked: {}
})(Radio)


export default function PaperDownload(props) {

    const { paper } = props;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const { isUser } = useAuth();
    const { toggleDrawer } = useNav();
    const { customSize, setCustomSize, crop, setCrop, resolution, setResolution } = usePaper();

    const resolutions = [
        { width: 3840, height: 1080, label: '32:9' },
        { width: 3440, height: 1440, label: '21:9' },
        { width: 2560, height: 1440, label: '16:9' },
    ]

    const handleClick = (event) => {
        if (isUser) {
            setAnchorEl(event.currentTarget);
        } else {
            toggleDrawer('login', true);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const changeCustom = (name, value) => {
        if (!Number(value)) return;
        setCustomSize({ ...customSize, [name]: value });
    }

    const downloadPaper = () => {
        console.log(paper);
        if (!isUser) {
            toggleDrawer('login', true);
            return;
        }

        const selectedRes = _.find(resolutions, r => r.label === resolution);

        const width = resolution === 'custom'
            ? customSize.width
            : selectedRes.width

        const height = resolution === 'custom'
            ? customSize.height
            : selectedRes.height

        // Build Params
        const params = {
            fit: crop,
            'fill-color': '#000000',
            'w': width,
            'h': height
        }

        const url = buildURL(`https://${process.env.IMGIX_URL}/${paper.source}`, params);

        saveAs(url, paper.filename);

        recordDownload();
    }

    const recordDownload = () => {
        window.api.axiosPost(`/api/paper/${paper.id}/downloaded`)
            .then(response => console.log("download recorded", response))
            .catch(error => console.log("error", error));
    }

    const open = Boolean(anchorEl);
    const id = open ? 'download-popover' : undefined;

    return (
        <Fragment>
            <IconButton
                aria-describedby={id}
                color="default"
                onClick={handleClick}
            >
                <FileDownloadIcon />
            </IconButton>
            <CssPopOver
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
            >
                <Grid container
                    className={classes.root}
                    direction="column"
                >

                    <FormControl component="fieldset">
                        <RadioGroup
                            row
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            aria-label="resolution"
                            name="row-radio-buttons-group"
                        >
                            {resolutions.map((res, index) => <FormControlLabel className={classes.label}
                                key={index}
                                value={res.label}
                                control={<CssRadio />}
                                label={res.label}
                            />)}
                            <FormControlLabel className={classes.label} value="custom" control={<CssRadio />} label="Custom" />
                        </RadioGroup>
                    </FormControl>

                    <Grid container>

                        <Grid item>
                            <FormControl component="fieldset">
                                <RadioGroup
                                    row
                                    value={crop}
                                    onChange={(e) => setCrop(e.target.value)}
                                    aria-label="resolution"
                                    name="row-radio-buttons-group"
                                >
                                    <FormControlLabel className={classes.label} value="crop" control={<CssRadio />} label="Crop" />
                                    <FormControlLabel className={classes.label} value="fill" control={<CssRadio />} label="Fit" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item>

                            <Grid
                                container
                                direction="row"
                                spacing={2}
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Grid item className={classes.inputContainer}>
                                    <InputTextField
                                        disabled={resolution !== 'custom'}
                                        size="small"
                                        fullWidth={false}
                                        placeholder='Width'
                                        value={customSize.width}
                                        onChange={e => changeCustom('width', e.target.value)}
                                    />
                                </Grid>
                                <Typography
                                    variant="body2"
                                    className={resolution === 'custom' ? classes.label : classes.disabled}
                                > X </Typography>
                                <Grid item className={classes.inputContainer}>
                                    <InputTextField
                                        disabled={resolution !== 'custom'}
                                        size="small"
                                        fullWidth={false}
                                        placeholder='Height'
                                        value={customSize.height}
                                        onChange={e => changeCustom('height', e.target.value)}
                                    />
                                </Grid>
                            </Grid>

                        </Grid>

                    </Grid>


                    <Button
                        color="default"
                        variant="contained"
                        className={classes.downloadButton}
                        startIcon={<SaveIcon />}
                        onClick={downloadPaper}
                    >Save Paper</Button>

                </Grid>
            </CssPopOver>
        </Fragment>
    );
}