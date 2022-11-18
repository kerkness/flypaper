import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import { makeStyles, withStyles } from '@mui/styles';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from "@mui/material/Typography";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '../../components/IconButton';
import { usePaper } from './paperSlice';


const useStyles = makeStyles((theme) => ({
    root: {
        // color: '#EEEEEE',
    },
    buttonGroup: {
        marginTop: 20,
    }
}));

const CssPopOver = withStyles({
    paper: {
        backgroundColor: 'rgba(60,80,90,0.9)',
        padding: 40,
        color: '#EEEEEE'
    }
})(Popover)


export default function PaperDelete(props) {

    const { paper } = props;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const { removePaper } = usePaper();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const deletePaper = () => {
        window.api.axiosDelete(`/api/paper/${paper.id}`)
            .then(response => {
                removePaper(paper);
                handleClose();
            })
            .catch(error => console.log("delete error", error));
    }

    const open = Boolean(anchorEl);
    const id = open ? 'delete-popover' : undefined;

    return (
        <Fragment>
            <IconButton aria-describedby={id} 
                // color="default" 
                onClick={handleClick} size="large">
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
                <Typography className={classes.root}>Are you sure you want to delete this paper?</Typography>

                <ButtonGroup className={classes.buttonGroup} variant="contained">
                    <Button onClick={deletePaper}>Yes</Button>
                    <Button onClick={handleClose}>No</Button>
                </ButtonGroup>
            </CssPopOver>
        </Fragment>
    );
}