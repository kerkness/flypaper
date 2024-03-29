import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles';
import { Grid, Toolbar, Typography, Button, ButtonGroup, } from "@mui/material";
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useAuth } from "../admin/authSlice";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import InputBase from '@mui/material/InputBase';
import IconButton from '../../components/IconButton';
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useHistory, useLocation } from "react-router-dom";
import { useNav } from "./navSlice";
import queryString from 'query-string';


const useStyles = makeStyles((theme) => ({
    spacer: {
        flexGrow: 1,
        flex: 2,
    },
    iconbutton: {
        color: '#ffffff'
    },
    buttonItem: {
        textAlign: 'center'
    },
    closeButton: {
        textAlign: 'right',
        paddingRight: 30,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        paddingRight: 15,
        width: '100%',
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '90%',
    },
    searchClear: {
        height: '100%',
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        width: '100%',
    },
    toggleButton: {

    }
}));

const FilterBar = (props) => {

    const { onClose } = props;
    const classes = useStyles();
    const { isUser } = useAuth();
    const history = useHistory();
    const location = useLocation();
    const [inputSearch, setInputSearch] = useState('');
    const { sort, search, toggleDrawer } = useNav();

    useEffect(() => {

        const params = queryString.parse(location.search);

        if (params.search) {
            setInputSearch(params.search);
        }

    }, [search])

    const keyPress = (e) => {
        if (e.keyCode == 13) {
            pushWithQuery({
                ...getParams(),
                search: inputSearch
            });
        }
    }

    const clearSearch = () => {
        setInputSearch('');
        pushWithQuery({
            ...getParams(),
            'search': ''
        })
    }

    const handleSort = (newSort) => {
        pushWithQuery({
            ...getParams(),
            'sort': newSort
        })
    }

    const getParams = () => {
        return queryString.parse(location.search);
    }

    const pushWithQuery = (params) => {
        history.push(params ? `/?${queryString.stringify(params)}` : `/`)
    }

    const goto = (page) => {
        if (page === 'liked' && !isUser ) {
            toggleDrawer('login', true);
            return;
        }

        history.push(`/${page}`);
    }

    const sortValue = location.pathname !== '/' ? '' : sort;

    return (
        <Toolbar>
            <Grid container
                spacing={2}
                justifyContent='space-between'
                alignItems='center'
            >
                <Grid item
                    xs={11}
                    md={3}
                >
                    <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search Tags…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            value={inputSearch}
                            onChange={(e) => setInputSearch(e.target.value)}
                            inputProps={{ 'aria-label': 'search' }}
                            onKeyDown={keyPress}
                        />
                        <IconButton
                            onClick={onClose}
                            color="inherit"
                            className={classes.searchClear}
                            onClick={() => clearSearch()}
                            size="large">
                            <CloseIcon />
                        </IconButton>
                    </div>
                </Grid>
                <Grid item
                    md={4}
                    xs={12}
                    className={classes.buttonItem}
                    >
                        <ToggleButtonGroup
                            exclusive
                            value={sortValue}
                            onChange={(e, v) => handleSort(v)}
                            size="small"
                        >
                            <ToggleButton value="featured">Featured</ToggleButton>
                            <ToggleButton value="created_at">Recent</ToggleButton>
                            <ToggleButton value="likes_count">Popular</ToggleButton>
                            <ToggleButton value="downloads_count">Downloads</ToggleButton>
                        </ToggleButtonGroup>

                </Grid>

                <Grid item
                    xs={12}
                    md={4}
                    className={classes.buttonItem}
                    >
                    <ButtonGroup
                        disableElevation
                        variant="outlined"
                        // color="default"
                    >
                        <Button onClick={() => goto('liked')} endIcon={<FavoriteIcon />}>Your</Button>
                        <Button onClick={() => goto('tags')}>Tags</Button>
                        <Button onClick={() => goto('creators')}>Creators</Button>
                        <Button onClick={() => goto('desktop')}>Sync</Button>
                    </ButtonGroup>
                </Grid>

            </Grid>
        </Toolbar>
    );
}

export default FilterBar;