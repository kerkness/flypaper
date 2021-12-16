import React from "react";
import TextField from "./InputTextField";
import { MenuItem } from "@mui/material";

const InputSelectField = (props) => {

    const { options, ...otherProps } = props;

    return (
        <TextField
            {...otherProps}
            select
        >
            {
                options && options.map((option, index) => <MenuItem
                    key={index}
                    value={option.slug}
                >
                    {option.label}
                </MenuItem>)
            }
        </TextField>
    )
}

export default InputSelectField;