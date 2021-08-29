import React, { useEffect, useState } from "react";
import _ from 'lodash';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from "@material-ui/core";
import ContentBox from "../../components/ContentBox";
import IconButton from "../../components/IconButton";
import { displayByteSize } from "../../components/useFileSizeConverter";
import useWindowSize from "../../components/useWindowSize";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from '@material-ui/icons/Edit';
import { categories } from "./paperSlice";
import { saveAs } from 'file-saver'
import { useAuth } from "../admin/authSlice";
import { useNav } from "../nav/navSlice";
import PaperDownload from "./PaperDownload";
import PaperDelete from "./PaperDelete";
import PaperEdit from "./PaperEdit";

const useStyles = makeStyles({
    tagLink: {
        marginLeft: '6px',
    },
    actionButtons: {
        textAlign: 'right',
    }
});

const TagLink = (props) => {

    const classes = useStyles()
    const { tag, index } = props;

    return (
        <span className={index ? classes.tagLink : null}>
            {tag.label}
        </span>
    )
}


const PaperDetails = (props) => {

    const classes = useStyles();
    const { paper } = props;
    const [liked, setLiked] = useState(false);
    const { isUser, canEdit } = useAuth();
    const { toggleDrawer } = useNav();
    const windowSize = useWindowSize();

    useEffect(() => {

        if (paper.user_liked)
            setLiked(true);

    }, [paper])

    const categoryLabel = (slug) => {
        const cat = _.find(categories, c => c.slug === slug);
        return cat ? cat.label : slug;
    }

    const heartPaper = () => {
        if (!isUser) {
            toggleDrawer('login', true);

            return;
        }

        if (liked) recordUnLike();
        if (!liked) recordLike();

        setLiked(!liked);

    }

    const recordLike = () => {
        window.api.axiosPost(`/api/paper/${paper.id}/like`)
            .then(response => console.log("like recorded", response))
            .catch(error => console.log("error", error));
    }

    const recordUnLike = () => {
        window.api.axiosDelete(`/api/paper/${paper.id}/like`)
            .then(response => console.log("unlike recorded", response))
            .catch(error => console.log("error", error));
    }

    return (
        <ContentBox>
            <Grid container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Grid xs={12} sm={12} item>
                    <Typography variant="body2">
                        {paper.user.name}
                        &nbsp;| {categoryLabel(paper.category)}
                        &nbsp;| {displayByteSize(paper.size)}
                        {
                            !paper.approved && <span style={{
                                paddingLeft: 20
                            }}>
                                ( Private )
                            </span>
                        }
                    </Typography>
                    {paper.tags.length > 0 &&
                        <Typography variant="body1">
                            {paper.tags.map(
                                (tag, index) => <TagLink key={index} index={index} tag={tag} />
                            )}
                        </Typography>
                    }
                    <Typography variant="body1">
                    </Typography>
                </Grid>
                    { canEdit(paper) && 
                        <Grid item xs={6}>
                            <PaperDelete paper={paper} />
                            <PaperEdit paper={paper} />
                        </Grid>
                    }
                    <Grid className={classes.actionButtons} xs={canEdit(paper) ? 6 : 12} item>
                    <IconButton color={liked ? "secondary" : "default"} onClick={heartPaper}>
                        <FavoriteIcon />
                    </IconButton>
                    <PaperDownload paper={paper} />
                </Grid>
            </Grid>

        </ContentBox>

    )
}

export default PaperDetails;
