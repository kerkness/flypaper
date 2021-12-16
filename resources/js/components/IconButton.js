import React, { Fragment, useState } from 'react';
import {IconButton as MuiIconButton} from "@mui/material";
import { withStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';

const CssIconButton = styled(MuiIconButton)({
    color: '#FFFFFF',
    '& .MuiIconButton-colorSecondary': {
        color: 'hotpink'
    }
});

// const CssIconButton = withStyles({
//     root: {
//         color: '#FFFFFF',
//     },
//     colorSecondary: {
//         color: 'hotpink'
//     },
// })(MuiIconButton);

const IconButton = (props) => {
    return (
        <CssIconButton {...props}>
            {props.children}
        </CssIconButton>
    )
}

export default IconButton;
