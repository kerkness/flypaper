import React, { Fragment, useState, useRef } from "react";
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { useTags } from "./tagSlice";
import { useNav } from '../nav/navSlice';
import { Grid, Avatar } from "@material-ui/core";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import Loading from "../../components/Loading";
import CustomChip from '../../components/CustomChip';
import { useHistory } from "react-router-dom";
import queryString from 'query-string';
import ParallaxGrid from "../../components/ParallaxGrid";

const useStyles = makeStyles({
    loading: {
        minHeight: '50vh',
        minWidth: '100vw',
    }
})

const AllTags = (props) => {

    const classes = useStyles();
    const history = useHistory();
    const [error, setError] = useState(false);
    const isLoading = useRef();
    const { sort } = useNav();
    const {
        tags,
        addTags,
        total,
        setTotal,
        hasNextPage,
        setHasNextPage,
    } = useTags();

    const loadMore = () => {

        if (isLoading.current) return;

        isLoading.current = true;

        api.axiosGet('/api/tag', {
            offset: tags ? tags.length : 0,
        })
            .then(response => {
                if (response.data && response.data.tags) {

                    const loadedTags = response.data.tags;

                    if (tags.length + loadedTags.length >= response.data.total) {
                        setHasNextPage(false);
                    }
                    setTotal(response.data.total);
                    addTags(loadedTags);
                }
                isLoading.current = false;
            }).catch(error => {
                setError(true);
                isLoading.current = false;
            })
    }

    const [tagsRef] = useInfiniteScroll({
        loading: isLoading.current === true ? true : false,
        hasNextPage,
        onLoadMore: loadMore,
        // When there is an error, we stop infinite loading.
        // It can be reactivated by setting "error" state as undefined.
        disabled: !!error,
        // `rootMargin` is passed to `IntersectionObserver`.
        // We can use it to trigger 'onLoadMore' when the sentry comes near to become
        // visible, instead of becoming fully visible on the screen.
        rootMargin: '0px 0px 400px 0px',
    });

    const clickTag = (slug) => {

        const str = queryString.stringify({
            search: slug,
            sort
        })

        history.push(`/?${str}`);
    }

    return (
        <Fragment>
            <ParallaxGrid>
                {tags.map((tag, index) => <Grid xs={6} sm={4} md={3} lg={2} item key={index}>

                    <CustomChip
                        avatar={<Avatar>{tag.papers_count}</Avatar>}
                        label={tag.label}
                        clickable
                        color="default"
                        onClick={() => clickTag(tag.slug)}
                    />
                </Grid>)}

                {(hasNextPage) && (
                    <Grid xs={12} item ref={tagsRef}>
                        <Grid container className={classes.loading}
                            justifyContent='center'
                            alignItems='center'
                        >
                            <Loading />
                        </Grid>
                    </Grid>
                )}
            </ParallaxGrid>
            
        </Fragment>

    )
}

export default AllTags;