import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import { makeStyles, withStyles } from '@mui/styles';
import Popover from '@mui/material/Popover';
import InputTagsField from '../../components/InputTagsField';
import SelectField from '../../components/InputSelectField';
import Button from '@mui/material/Button';
import {
    Grid,
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import { useFormik } from 'formik';
import IconButton from '../../components/IconButton';
import { usePaper } from './paperSlice';
import { useSubmission } from '../submit/submitSlice';
import { editPaperSchema } from '../../schema/paper';

const useStyles = makeStyles((theme) => ({
    grid: {},
    cancelButton: {
        marginLeft: '20px',
        color: '#EEEEEE'
    },
}));

const CssPopOver = withStyles({
    paper: {
        width: 450,
        maxWidth: '70vw',
        backgroundColor: 'rgba(60,80,90,0.9)',
        padding: 40,
        color: '#EEEEEE'
    }
})(Popover)


export default function PaperEdit(props) {

    const { paper } = props;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const { updatePaper } = usePaper();
    const { categories } = useSubmission();

    const defaultValue = paper.tags && paper.tags.length
        ? paper.tags.map(pt => pt.label ? pt.label : '')
        : [];

    const form = useFormik({
        initialValues: {
            category: paper.category ? paper.category : 'standard',
            tags: defaultValue,
        },
        validationSchema: editPaperSchema,
    });

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        form.resetForm();
    };

    const onChange = (value, field) => {
        form.setFieldValue(field, value);
    }

    const handleSave = () => {

        api.axiosPut(`/api/paper/${paper.id}`, {
            ...form.values
        }).then(response => {

            updatePaper(response.data, paper.id);
            handleClose();

        }).catch(error => console.log(error));
    };

    const open = Boolean(anchorEl);
    const id = open ? 'delete-popover' : undefined;

    return (
        <Fragment>
            <IconButton aria-describedby={id} 
                // color="default" 
                onClick={handleClick} size="large">
                <EditIcon />
            </IconButton>
            <CssPopOver
                className={classes.popover}
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
                    className={classes.grid}
                    spacing={3}
                    direction="column"
                    justifyContent="center"
                    alignItems="stretch"
                >
                    <Grid item>
                        <SelectField
                            name="category"
                            label="Category"
                            form={form}
                            options={categories}
                            value={form.values.category}
                            onChange={(e) => onChange(e.target.value, 'category')}
                        />
                    </Grid>
                    <Grid item>
                        <InputTagsField
                            name="tags"
                            label="Tags"
                            // value={values.tags}
                            defaultValue={defaultValue}
                            onChange={(tags) => onChange(tags, 'tags')}
                        />
                    </Grid>
                    <Grid item>
                        <Button variant="contained" onClick={handleSave}>
                            Save
                        </Button>
                        <Button
                            className={classes.cancelButton}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </Grid>
                </Grid>

            </CssPopOver>
        </Fragment>
    );
}