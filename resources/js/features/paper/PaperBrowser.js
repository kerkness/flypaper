import React, { Fragment, useEffect } from "react";
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { usePaper } from "./paperSlice";
import BackgroundPaper from "./BackgroundPaper";
import { Grid } from "@material-ui/core";
import PaperDetails from "./PaperDetails";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import CircularProgress from '@material-ui/core/CircularProgress';


const useStyles = makeStyles({
    root: {
        minHeight: "100vh",
    },
    liked: {
        color: 'hotpink'
    },
});

const PaperBrowser = (props) => {

    const classes = useStyles();
    const {
        papers,
        addPapers,
        loading,
        hasNextPage,
        error,
        setLoading,
        setError,
        setHasNextPage
    } = usePaper();

    const papier = papers && papers.length ? papers : []

    const loadMore = () => {

        setLoading(true);

        window.api.axiosGet('/api/paper', {
            offset: papers.length
        })
        .then(response => {
            if (response.data && response.data.papers) {
                const loadedPaper = response.data.papers;
                if (papers.length + loadedPaper.length >= response.data.total) {
                    setHasNextPage(false);
                }
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

    return (
        <Fragment>

            <Grid container
                spacing={0}
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                {papier.map((pap, index) => <BackgroundPaper key={index} paper={pap} />)}

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