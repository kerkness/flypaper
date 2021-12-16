/* eslint-disable no-use-before-define */
import React from 'react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from './InputTextField';
// import { useSubmission } from '../features/submit/submitSlice';

const availableTags = [];

export default function Tags(props) {

  const { onChange, defaultValue, ...textFieldProps } = props;

  const handleChange = (event, tags) => {
    onChange && onChange(tags);
  }



  return (
      <Autocomplete
        multiple
        id={textFieldProps.name}
        options={availableTags.map((option) => option.title)}
        defaultValue={defaultValue ? defaultValue : ['MSFS']}
        freeSolo
        onChange={handleChange}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip label={option} {...getTagProps({ index })} />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} {...textFieldProps} />
        )}
      />
  );
}

