import React, { useEffect, useState } from "react";
import _ from 'lodash';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Grid, Typography, IconButton } from "@material-ui/core";
import ContentBox from "../../components/ContentBox";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { displaySize } from "../../components/useSizes";
import useWindowSize from "../../components/useWindowSize";
import FileDownloadIcon from '@material-ui/icons/GetApp';
import { categories } from "./paperSlice";
import { saveAs } from 'file-saver'
import { useAuth } from "../admin/authSlice";
import { useNav } from "../nav/navSlice";
import PaperDownload from "./PaperDownload";

const useStyles = makeStyles({
    tagLink: {
        marginLeft: '6px',
    }
});

const CssIconButton = withStyles({
    root: {
        color: '#FFFFFF'
    },
    colorSecondary: {
        color: 'hotpink'
    },
})(IconButton);


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

    const { paper } = props;
    const [liked, setLiked] = useState(false);
    const { isUser } = useAuth();
    const { openLogin, closeLogin } = useNav();
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
            openLogin();
            return;
        }

        if (liked) recordUnLike();
        if (!liked) recordLike();

        setLiked(!liked);

    }

    const recordLike = () => {
        window.api.axiosPost(`/api/like/${paper.id}`)
            .then(response => console.log("like recorded", response))
            .catch(error => console.log("error", error));
    }

    const recordUnLike = () => {
        window.api.axiosPost(`/api/unlike/${paper.id}`)
            .then(response => console.log("unlike recorded", response))
            .catch(error => console.log("error", error));
    }

    const width = windowSize.width ? '' : ''

    return (
        <ContentBox width={400} height={200}>
            <Grid container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Grid item>
                    <Typography variant="body2">
                        {paper.user.name}
                        &nbsp;| {categoryLabel(paper.category)}
                        &nbsp;| {displaySize(paper.size)}
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
                <Grid item>
                    <CssIconButton color={liked ? "secondary" : "default"} onClick={heartPaper}>
                        <FavoriteIcon />
                    </CssIconButton>
                    <PaperDownload paper={paper} />
                </Grid>
            </Grid>

        </ContentBox>

    )
}

export default PaperDetails;
