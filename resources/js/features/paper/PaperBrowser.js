import React, { Fragment, useEffect, useRef } from "react";
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

const useStyles = makeStyles({
    noPaper: {
        minHeight: '100vh',
        minWidth: '100vw',
        backgroundColor: '#444444',
        color: '#F1F1F1'
    }
})

const PaperBrowser = (props) => {

    const classes = useStyles();
    const location = useLocation();
    // const [offset, setOffset] = useState(0);
    // const [sort, setSort] = useState('');
    const shouldRefresh = useRef();
    const { sort, setSort, offset, setOffset, search, setSearch } = useNav();
    const {
        papers,
        addPapers,
        removeAllPaper,
        loading,
        hasNextPage,
        error,
        setLoading,
        setError,
        setHasNextPage
    } = usePaper();

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

        setLoading(true);

        api.axiosGet('/api/paper', {
            offset,
            sort,
            search,
        })
        .then(response => {
            if (response.data && response.data.papers) {
                const loadedPaper = response.data.papers;
                if (papers.length + loadedPaper.length >= response.data.total) {
                    setHasNextPage(false);
                }
                setOffset(papers.length + response.data.papers.length);
                addPapers(response.data.papers);
            }
            setLoading(false);
        }).catch(error => {
            setError(true);
            setLoading(false);
        })
    }

    const [sentryRef] = useInfiniteScroll({
        loading,
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

    // console.log("location", location)

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

                {(loading || hasNextPage) && (
                    <Grid item ref={sentryRef}>
                        <CircularProgress color="secondary" />
                    </Grid>
                )}
            </Grid>

        </Fragment>

    )
}

export default PaperBrowser;