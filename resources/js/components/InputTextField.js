import React from "react";
import { TextField } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const CssTextField = withStyles({
    root: {
        '& label.Mui-focused': {
            color: '#FFFFFF',
        },
        '& label': {
            color: '#EEEEEE',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: '#EEEEEE',
        },
        '& .MuiSelect-root': {
            color: '#CCCCCC'
        },
        '& .MuiOutlinedInput-root': {
            '& input': {
                color: '#CCCCCC',
            },
            '& fieldset': {
                color: '#CCCCCC',
            },
            '&:hover fieldset': {
                borderColor: '#EEEEEE',
            },
            '&.Mui-focused fieldset': {
                borderColor: '#ffffff',
            },
        },
        '& .MuiOutlinedInput-root.Mui-disabled': {
            '& input': {
                color: '#555555',
                borderColor: '#555555',
            },
            '& fieldset': {
                color: '#555555',
                borderColor: '#555555',
            },
            '&:hover fieldset': {
                color: '#555555',
                borderColor: '#555555',
            },
        },

    },
})(TextField);

const InputTextField = (props) => {

    const { name, label, form, ...params } = props;

    return (
        <CssTextField
            fullWidth
            variant="outlined"
            id={name}
            name={name}
            label={label}
            {...params}
            onBlur={form ? form.handleBlur : () => { }}
            error={
                (form && form.touched[name]) && Boolean(form.errors[name])
            }
            helperText={
                (form && form.touched[name]) && form.errors[name]
            }
        />
    )
}

export default InputTextField;
