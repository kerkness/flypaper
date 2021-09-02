import React, { useEffect, useState } from "react";
import _ from 'lodash';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Grid, Typography, Badge } from "@material-ui/core";
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
import PaperApprove from "./PaperApprove";
import PaperFeatured from "./PaperFeatured";
import PaperLike from "./PaperLike";
import { Link, useLocation } from "react-router-dom";
import queryString from 'query-string';
import { Fragment } from "react-is";

const useStyles = makeStyles({
    tagLink: {
        marginLeft: '6px',
    },
    link: {
        textDecoration: 'none',
        color: '#F1F1F1',
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
            <SearchLink keyword={tag.slug} label={tag.label} />
        </span>
    )
}

const SearchLink = (props) => {

    const classes = useStyles()
    const location = useLocation();
    const { keyword, label } = props;
    const params = queryString.parse(location.search);

    const search = {
        ...params,
        search: keyword
    }
    return (
        <Link
            className={classes.link}
            to={{
                pathname: '/',
                search: `?${queryString.stringify(search)}`
            }}
        >{label}</Link>
    )
}

const PaperDetails = (props) => {

    const { fullWidth } = props;
    const classes = useStyles();
    const { paper } = props;
    const { canEdit, canPublish } = useAuth();

    const categoryLabel = (slug) => {
        const cat = _.find(categories, c => c.slug === slug);
        return cat ? cat.label : slug;
    }

    return (
        <ContentBox fullWidth={fullWidth}>
            <Grid container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
            >
                <Grid xs={12} sm={12} item>
                    <Typography variant="body2">
                        <SearchLink keyword={paper.user.name} label={paper.user.name} />
                        &nbsp;| <SearchLink keyword={paper.category} label={categoryLabel(paper.category)} />
                        &nbsp;| {displayByteSize(paper.size)}
                        {
                            !paper.approved && <span>&nbsp;| Private</span>
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
                {canEdit(paper) &&
                    <Grid item xs={8}>
                        <PaperDelete paper={paper} />
                        <PaperEdit paper={paper} />
                        {
                            canPublish() && <Fragment>
                                <PaperApprove paper={paper} />
                                <PaperFeatured paper={paper} />
                            </Fragment>
                        }
                    </Grid>
                }
                <Grid className={classes.actionButtons} xs={canEdit(paper) ? 4 : 12} item>
                    <PaperLike paper={paper} />
                    <PaperDownload paper={paper} />
                </Grid>
            </Grid>

        </ContentBox>

    )
}

export default PaperDetails;
