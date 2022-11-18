import React, { Fragment, useEffect, useRef, useState } from "react";
import _ from 'lodash';
import { makeStyles } from '@mui/styles';
import { usePaper } from "./paperSlice";
import BackgroundPaper from "./BackgroundPaper";
import { Button, Grid, Typography } from "@mui/material";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import { useNav } from "../nav/navSlice";
import Loading from "../../components/Loading";
import { usePaperLoader } from "./PaperLoader";
import TiledPaper from "./TiledPaper";
import useWindowSize from '../../components/useWindowSize';
import useDebounce from '../../components/useDebounce';
import ImageList from '@mui/material/ImageList';
import PrevIcon from '@mui/icons-material/ArrowBackIosNew';
import NextIcon from '@mui/icons-material/ArrowForwardIos';
import { Box } from "@mui/system";
import LightboxProvider from "./lightbox/LightboxContextProvider";


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
    const topRef = useRef()
    const isLoading = useRef();
    const { page, setPage, sort, setSort, setOffset, search, setSearch } = useNav();
    const win = useWindowSize();
    const debouncedWin = useDebounce(win, 1000);
    const {
        papers,
        removeAllPaper,
        hasNextPage,
        error,
        setHasNextPage,
        mosaic,
    } = usePaper();
    const { loadPaper } = usePaperLoader();

    const papier = papers && papers.length ? papers : []
    // const isGrid = location.pathname === '/grid' ? true : false;
    const params = queryString.parse(location.search);
    const isGrid = params.grid ? true : false;


    useEffect(() => {

        if (isGrid) {
            const useWin = debouncedWin.width
                ? debouncedWin
                : { width: window.innerWidth, height: window.innerHeight };

            console.log("Load paper with", useWin, debouncedWin, win);

            removeAllPaper();
            setOffset(0);
            setHasNextPage(true);
            loadPaper(useWin, true, 0);
        }

    }, []);


    useEffect(() => {

        const query = queryString.parse(location.search);

        shouldRefresh.current = false;

        if ('sort' in query && query.sort !== sort) {
            setSort(query.sort);
            shouldRefresh.current = true;
        }

        if ('search' in query && query.search !== search) {
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


    const loadMore = (page = 0) => {

        if (isLoading.current) return;

        isLoading.current = true;

        loadPaper(debouncedWin, isGrid, page).then(response => {
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

    const nextPage = () => {
        if (hasNextPage) {
            const next = page + 1
            setPage(next);
            loadMore(next);
            topRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const prevPage = () => {
        if (page > 0) {
            const prev = page - 1;
            setPage(prev);
            loadMore(prev);
            topRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }


    const renderMasonry = () => {
        return (
            <ImageList variant="masonry" cols={3} spacing={0}>
                {papier.map((pap, index) => <TiledPaper key={index} paper={pap} />)}
            </ImageList>
        )
    }

    return (
        <Fragment>
            {isGrid && <Box ref={topRef} sx={{ height: 52 }} />}
            <LightboxProvider>
            <Grid container
                spacing={0}
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                {isGrid ? renderMasonry() : papier.map((pap, index) => <BackgroundPaper key={index} paper={pap} />)}


                {papier.length === 0 && <Grid container
                    justifyContent='center'
                    alignItems='center'
                    className={classes.noPaper}
                >
                    <Grid item>
                        <Typography>FETCHING PAPER</Typography>
                    </Grid>
                </Grid>}

                {(hasNextPage && !isGrid) && (
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

            {isGrid && <Box sx={{
                height: 150,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-evenly',
                alignItems: 'center'
            }}>
                <Button
                    color='secondary'
                    disabled={page <= 0}
                    onClick={() => prevPage()}
                    startIcon={<PrevIcon />}
                >
                    Prev Page
                </Button>
                <Button
                    color='secondary'
                    disabled={!hasNextPage}
                    onClick={() => nextPage()}
                    endIcon={<NextIcon />}
                >
                    Next Page
                </Button>
            </Box>
            }
</LightboxProvider>
        </Fragment>

    )
}

export default PaperBrowser;