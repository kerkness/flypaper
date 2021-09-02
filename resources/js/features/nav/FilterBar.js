import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles';
import { Grid, Toolbar, Typography, Button, ButtonGroup } from "@material-ui/core";
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import { useAuth } from "../admin/authSlice";
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '../../components/IconButton';
import FavoriteIcon from "@material-ui/icons/Favorite";
import { useHistory, useLocation } from "react-router-dom";
import { useNav } from "./navSlice";
import queryString from 'query-string';


const CssToggleButton = withStyles({
    label: {
        color: '#EEEEEE',
        paddingLeft: 10,
        paddingRight: 10,
    },
    selected: {
        color: 'hotpink'
    },
    root: {
        '&.Mui-selected': {
            backgroundColor: 'rgba(20,20,20,0.5)',
            '& span': {
                color: '#FFFFFF'
            },
        },
        backgroundColor: 'transparent',
    },
})(ToggleButton)



const CssGroupButton = withStyles({
    root: {
        backgroundColor: 'rgba(20,20,20,0.5)',
        '& span': {
            color: '#EEEEEE'
        },
    },
})(Button)


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
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
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
            ...getParams,
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
                        >
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
                        variant="contained"
                        exclusive
                        color="default"
                        value={sortValue}
                        onChange={(e, v) => handleSort(v)}
                        size='small'
                    >
                        <CssToggleButton value="featured">Featured</CssToggleButton>
                        <CssToggleButton value="created_at">Recent</CssToggleButton>
                        <CssToggleButton value="likes_count">Popular</CssToggleButton>
                        <CssToggleButton value="downloads_count">Downloads</CssToggleButton>
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
                        color="default"
                    >
                        <CssGroupButton onClick={() => goto('liked')} endIcon={<FavoriteIcon />}>Your</CssGroupButton>
                        <CssGroupButton onClick={() => goto('tags')}>Tags</CssGroupButton>
                        <CssGroupButton onClick={() => goto('creators')}>Creators</CssGroupButton>
                    </ButtonGroup>
                </Grid>

            </Grid>
        </Toolbar>
    )
}

export default FilterBar;