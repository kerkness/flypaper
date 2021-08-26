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
import DeleteIcon from '@material-ui/icons/Delete';
import { useAuth } from '../admin/authSlice';
import { useNav } from '../nav/navSlice';
import InputTextField from '../../components/InputTextField';
import IconButton from '../../components/IconButton';
import { usePaper } from './paperSlice';
import { buildURL } from 'react-imgix';


const useStyles = makeStyles((theme) => ({
}));

const CssPopOver = withStyles({
    paper: {
        backgroundColor: '#333333',
        padding: 40,
    }
})(Popover)


export default function PaperDelete(props) {

    const { paper } = props;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const { isUser } = useAuth();
    const { openLogin } = useNav();
    const { customSize, setCustomSize, crop, setCrop, resolution, setResolution } = usePaper();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'delete-popover' : undefined;

    return (
        <Fragment>
            <IconButton
                aria-describedby={id}
                color="default"
                onClick={handleClick}
            >
                <DeleteIcon />
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
                <Typography>Are you sure you want to delete this paper?</Typography>
            </CssPopOver>
        </Fragment>
    );
}