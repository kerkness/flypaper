import React, { Fragment, useState } from 'react';
import {IconButton as MuiIconButton} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

const CssIconButton = withStyles({
    root: {
        color: '#FFFFFF',
    },
    colorSecondary: {
        color: 'hotpink'
    },
})(MuiIconButton);

const IconButton = (props) => {
    return (
        <CssIconButton {...props}>
            {props.children}
        </CssIconButton>
    )
}

export default IconButton;
