import React, { Fragment, useEffect, useRef } from "react";
import _ from 'lodash';
import { makeStyles, withStyles } from '@mui/styles';
import { usePaper } from "./paperSlice";
import BackgroundPaper from "./BackgroundPaper";
import { Grid, Typography } from "@mui/material";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import CircularProgress from '@mui/material/CircularProgress';
import { useLocation } from "react-router-dom";
import queryString from 'query-string';
import { useNav } from "../nav/navSlice";
import Loading from "../../components/Loading";

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

const UserLiked = (props) => {

    const classes = useStyles();
    const isLoading = useRef();
    const { likedOffset, setLikedOffset } = useNav();
    const {
        liked,
        addLikedPapers,
        hasNextLikedPage,
        error,
        setError,
        setHasNextLikedPage
    } = usePaper();

    const papier = liked && liked.length ? liked : []

    const loadMore = () => {

        console.log("Load More");

        if (isLoading.current) return;

        isLoading.current = true;

        api.axiosGet('/api/paper/liked', {
            offset: likedOffset,
        })
        .then(response => {
            if (response.data && response.data.papers) {
                
                // Get array of Ids from found items
                const arrayOfIDs = _.map(liked, pap => pap.id);
                // Only get papers not already liked (filters out recent likes)
                const loadedPaper = response.data.papers.filter(pap => !arrayOfIDs.includes(pap.id));

                if (liked.length + loadedPaper.length >= response.data.total) {
                    setHasNextLikedPage(false);
                }

                setLikedOffset(liked.length + loadedPaper.length);
                addLikedPapers(loadedPaper);
            }
            isLoading.current = false;
        }).catch(error => {
            setError(true);
            isLoading.current = false;
        })
    }

    const [likedRef] = useInfiniteScroll({
        loading: isLoading.current === true ? true : false,
        hasNextPage: hasNextLikedPage,
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

                {(hasNextLikedPage) && (
                    <Grid item ref={likedRef}>
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

export default UserLiked;