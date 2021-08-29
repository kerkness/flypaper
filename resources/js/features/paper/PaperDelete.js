import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Typography from "@material-ui/core/Typography";
import DeleteIcon from '@material-ui/icons/Delete';
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
        backgroundColor: '#333333',
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
                console.log("paper deleted", response);
                removePaper(paper);
                handleClose();
            })
            .catch(error => console.log("delete error", error));
    }

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
                <Typography className={classes.root}>Are you sure you want to delete this paper?</Typography>

                <ButtonGroup className={classes.buttonGroup} variant="contained" color="primary">
                    <Button onClick={deletePaper}>Yes</Button>
                    <Button onClick={handleClose}>No</Button>
                </ButtonGroup>
            </CssPopOver>
        </Fragment>
    );
}