import React, { Fragment, useState, useRef } from "react";
import _ from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { useCreators } from "./creatorSlice";
import { useNav } from '../nav/navSlice';
import { Grid, Avatar } from "@material-ui/core";
import useInfiniteScroll from 'react-infinite-scroll-hook';
import Loading from "../../components/Loading";
import CustomChip from '../../components/CustomChip';
import { useHistory } from "react-router-dom";
import queryString from 'query-string';
import ParallaxGrid from "../../components/ParallaxGrid";

const useStyles = makeStyles({
    tagContainer: {
        minHeight: '100vh',
        paddingTop: 175,
        paddingLeft: 40,
        paddingRight: 40,
        paddingBottom: 150,
    },
    loading: {
        minHeight: '50vh',
        minWidth: '100vw',
    }
})



const AllCreators = (props) => {

    const classes = useStyles();
    const history = useHistory();
    const [error, setError] = useState(false);
    const isLoading = useRef();
    const { sort } = useNav();
    const {
        creators,
        addCreators,
        total,
        setTotal,
        hasNextPage,
        setHasNextPage,
    } = useCreators();


    const loadMore = () => {

        if (isLoading.current) return;

        isLoading.current = true;

        api.axiosGet('/api/creator', {
            offset: creators ? creators.length : 0,
            sort,
        })
            .then(response => {
                if (response.data && response.data.creators) {

                    const loadedCreators = response.data.creators;

                    if (creators.length + loadedCreators.length >= response.data.total) {
                        setHasNextPage(false);
                    }
                    setTotal(response.data.total);
                    console.log("adding creators", loadedCreators);
                    addCreators(loadedCreators);
                }
                isLoading.current = false;
            }).catch(error => {
                setError(true);
                isLoading.current = false;
            })
    }

    const [creatorsRef] = useInfiniteScroll({
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

    const clickCreator = (name) => {

        const str = queryString.stringify({
            search: name,
            sort
        })

        history.push(`/?${str}`);
    }

    return (
        <Fragment>
            <ParallaxGrid>
                {creators.map((creator, index) => <Grid xs={6} sm={4} md={3} lg={2} item key={index}>

                    <CustomChip
                        avatar={<Avatar>{creator.papers_count}</Avatar>}
                        label={creator.name}
                        clickable
                        color="default"
                        onClick={() => clickCreator(creator.name)}
                    />
                </Grid>)}

                {(hasNextPage) && (
                    <Grid xs={12} item ref={creatorsRef}>
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

export default AllCreators;