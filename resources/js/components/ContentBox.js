import * as React from 'react';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import { makeStyles } from '@mui/styles';

// import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
  root: {
      color: '#EEEEEE',
      padding: 20,
  },
  notFullWidth: {
    margin: 20,
    width: 375,
    maxWidth: '100%',
    backgroundColor: "rgba(20,20,20,0.5)",
    "&:hover": {
      backgroundColor: "rgba(20,20,20,0.75)",
    },
},
  fullWidth: {
    width: '90vw',
    backgroundColor: 'transparent'
  }
});


export default function ContentBox(props) {

  const { fullWidth } = props;
  const classes = useStyles();

  return (
    <Box className={clsx({
      [classes.root]: true,
      [classes.fullWidth]: fullWidth,
      [classes.notFullWidth]: !fullWidth,
    })}
    >{props.children}</Box>
  );
}