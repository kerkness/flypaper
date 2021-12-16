import React, { Fragment } from 'react';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import IconButton from '../../components/IconButton';
import { usePaper } from './paperSlice';

export default function PaperApprove (props) {

    const { paper } = props;
    const { updatePaper } = usePaper();

    const approvePaper = () => {
        window.api.axiosPut(`/api/paper/${paper.id}`, {
            approved: !paper.approved,
        })
            .then(response => {
                updatePaper(response.data, paper.id);
            })
            .catch(error => console.log("delete error", error));
    }

    return (
        <Fragment>
            <IconButton 
                // color="default" 
                onClick={approvePaper} size="large">
                {
                    paper.approved === 1 &&
                    <RemoveCircleIcon />
                }
                {
                    paper.approved === 0 &&
                    <LibraryAddCheckIcon />
                }
            </IconButton>
        </Fragment>
    );
}