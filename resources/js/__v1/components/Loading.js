import React from 'react';
import { withStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';

const BorderCircularProgress = withStyles((theme) => ({
    colorPrimary: {
        color: 'hotpink !important',
    },
  }))(CircularProgress);

const Loading = (props) => {
    return (
        <BorderCircularProgress thickness={1.5} size={80} color='primary'/>
    )
}

export default Loading;