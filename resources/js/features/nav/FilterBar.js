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
import { useHistory, useLocation } from "react-router-dom";
import { useNav } from "./navSlice";
import queryString from 'query-string';


const CssToggleButton = withStyles({
    label: {
        color: '#EEEEEE',
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

const useStyles = makeStyles((theme) => ({
    spacer: {
        flexGrow: 1,
        flex: 2,
    },
    iconbutton: {
        color: '#ffffff'
    },
    catButtons: {
        // marginLeft: 20,
    },
    closeButton: {
        textAlign: 'right',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        // [theme.breakpoints.up('sm')]: {
        //     marginLeft: theme.spacing(1),
        //     width: 'auto',
        // },
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
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        // transition: theme.transitions.create('width'),
        width: '100%',
        // backgroundColor: 'hotpink'
        // [theme.breakpoints.up('sm')]: {
        //     width: '100%',
        //     // '&:focus': {
        //     //     width: '20ch',
        //     // },
        // },
    },
    toggleButton: {

    }
}));

const FilterBar = (props) => {

    const { onClose } = props;
    const classes = useStyles();
    const { user } = useAuth();
    const history = useHistory();
    const location = useLocation();
    const [inputSearch, setInputSearch] = useState('');
    const { sort, search } = useNav();

    useEffect(() => {

        const params = queryString.parse(location.search);

        if (params.search) {
            setInputSearch(params.search);
        }

    }, [])

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

    return (
        <Toolbar>
            <Grid container
                spacing={2}
                justifyContent='space-between'
                alignItems='center'
            >
                <Grid item
                    xs={12}
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
                    md={5}
                    xs={10}
                >
                    <ToggleButtonGroup
                        className={classes.catButtons}
                        variant="contained"
                        exclusive
                        color="default"
                        value={sort}
                        onChange={(e, v) => handleSort(v)}
                        size='small'
                    >
                        <CssToggleButton value="created_at">Most Recent</CssToggleButton>
                        <CssToggleButton value="likes_count">Most Popular</CssToggleButton>
                        <CssToggleButton value="downloads_count">Most Downloaded</CssToggleButton>
                    </ToggleButtonGroup>

                </Grid>

                {/* <Grid item
                    xs={5}
                    md={3}
                >
                    <ButtonGroup
                        className={classes.catButtons}
                        disableElevation
                        variant="contained"
                        color="default"
                    >
                        <Button>All Tags</Button>
                        <Button>Creators</Button>
                    </ButtonGroup>
                </Grid> */}

                <Grid item
                    xs={1}
                    className={classes.closeButton}
                >
                    <IconButton
                        onClick={onClose}
                        color="inherit"
                        className={classes.iconbutton}
                    >
                        <CloseIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Toolbar>
    )
}

export default FilterBar;