import * as React from 'react';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
      color: '#EEEEEE',
      backgroundColor: "rgba(20,20,20,0.5)",
      padding: 20,
      "&:hover": {
        backgroundColor: "rgba(20,20,20,0.75)",
      }
  },
});


export default function ContentBox(props) {

  const classes = useStyles();
  const {width} = props;

  return (
    <Box className={classes.root}
      sx={{
        width,
      }}
    >{props.children}</Box>
  );
}