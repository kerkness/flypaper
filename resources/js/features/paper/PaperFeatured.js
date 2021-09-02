import React, { Fragment } from 'react';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import StarIcon from '@material-ui/icons/Star';
import IconButton from '../../components/IconButton';
import { usePaper } from './paperSlice';

export default function PaperFeatured (props) {

    const { paper } = props;
    const { updatePaper } = usePaper();

    const featurePaper = () => {
        window.api.axiosPut(`/api/paper/${paper.id}`, {
            featured: !paper.featured,
        })
            .then(response => {
                updatePaper(response.data, paper.id);
            })
            .catch(error => console.log("feature error", error));
    }

    return (
        <Fragment>
            <IconButton
                color="default"
                onClick={featurePaper}
            >
                {
                    paper.featured === 1 &&
                    <StarIcon />
                }
                {
                    paper.featured === 0 &&
                    <StarOutlineIcon />
                }
            </IconButton>
        </Fragment>
    );
}