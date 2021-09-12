import React, { useEffect, useState } from "react";
import _ from 'lodash';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from "@material-ui/core";
import ContentBox from "../../components/ContentBox";
import IconButton from "../../components/IconButton";
import { displayByteSize } from "../../components/useFileSizeConverter";
import CloseIcon from "@material-ui/icons/Close";
import InfoIcon from '@material-ui/icons/Info';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser';
import { categories, usePaper } from "./paperSlice";
import { useAuth } from "../admin/authSlice";
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
    },
    closeButton: {
        color: 'rgba(20,20,20,0.5)',
        position: 'relative',
        top: -185,
        float: 'left',
        marginLeft: 10
    },
    infoButton: {
        color: 'rgba(255,255,255,0.5)',
        position: 'relative',
        top: 0,
        float: 'left',
        margin: 0
    },

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

    const { fullWidth, show, showToggle } = props;
    const classes = useStyles();
    const { paper } = props;
    const { canEdit, canPublish } = useAuth();
    const { showInfo, toggleInfo } = usePaper();

    const categoryLabel = (slug) => {
        const cat = _.find(categories, c => c.slug === slug);
        return cat ? cat.label : slug;
    }

    return (
        <div>
            {showInfo && <ContentBox fullWidth={fullWidth}>
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
                                    <IconButton onClick={() => window.open(`/render/${paper.id}`)}>
                                        <OpenInBrowser />
                                    </IconButton>
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

            }
            <IconButton onClick={toggleInfo} className={ showInfo ? classes.closeButton : classes.infoButton}>
                { showInfo ? <CloseIcon /> : <InfoIcon />}
            </IconButton>
        </div>
    )
}

export default PaperDetails;
