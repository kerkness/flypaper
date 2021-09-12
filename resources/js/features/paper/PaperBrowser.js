import React, { Fragment, useEffect, useRef, useState } from "react";
import _ from 'lodash';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { usePaper } from "./paperSlice";
import BackgroundPaper from "./BackgroundPaper";
import { Grid, Typography } from "@material-ui/core";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import { useNav } from "../nav/navSlice";
import Loading from "../../components/Loading";
import { usePaperLoader } from "./PaperLoader";

const useStyles = makeStyles({
    noPaper: {
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: '#444444',
        color: '#F1F1F1'
    },
    loading: {
        minHeight: '50vh',
        minWidth: '100vw',
    }
})

const PaperBrowser = (props) => {

    const classes = useStyles();
    const location = useLocation();
    const shouldRefresh = useRef();
    const isLoading = useRef();
    const { sort, setSort, setOffset, search, setSearch } = useNav();
    const {
        papers,
        removeAllPaper,
        hasNextPage,
        error,
        setHasNextPage,
    } = usePaper();
    const { loadPaper } = usePaperLoader();

    const papier = papers && papers.length ? papers : []

    useEffect(() => {

        const query = queryString.parse(location.search);

        shouldRefresh.current = false; 
        
        if('sort' in query && query.sort !== sort) {
            setSort(query.sort);
            shouldRefresh.current = true;
        }

        if('search' in query && query.search !== search) {
            setSearch(query.search);
            shouldRefresh.current = true;
        }

        if (shouldRefresh.current) {
            setOffset(0);
            removeAllPaper();
            setHasNextPage(true);
            shouldRefresh.current = false;
        }

    }, [location.search])


    const loadMore = () => {

        if (isLoading.current) return;

        isLoading.current = true;

        loadPaper().then(response => {
            isLoading.current = false;
        }).catch(error => {
            isLoading.current = false;
        })

    }

    const [sentryRef] = useInfiniteScroll({
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

    return (
        <Fragment>

            <Grid container
                spacing={0}
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                {papier.map((pap, index) => <BackgroundPaper key={index} paper={pap} />)}

                {papier.length === 0 && <Grid container
                    justifyContent='center'
                    alignItems='center'
                    className={classes.noPaper} 
                >
                    <Grid item>
                    <Typography>NO PAPER</Typography>    
                </Grid>
                </Grid>}

                {(hasNextPage) && (
                    <Grid item ref={sentryRef}>
                        <Grid container className={classes.loading}
                            justifyContent='center'
                            alignItems='center'
                        >
                            <Loading />
                        </Grid>
                    </Grid>
                )}
            </Grid>

        </Fragment>

    )
}

export default PaperBrowser;