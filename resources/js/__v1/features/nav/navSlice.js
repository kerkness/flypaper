import { createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
	showFilter: false,
	login: false,
	submit: false,
	info: false,
	account: false,
	sort: 'featured',
	offset: 0,
	likedOffset: 0,
	page: 0,
	search: ''
}

export const navSlice = createSlice({
	name: 'nav',
	initialState,
	reducers: {
		toggleDrawer: (state, action) => {
			const { drawer, open } = action.payload;
			state[drawer] = open;
		},
		setOffset: (state, action) => {
			state.offset = action.payload;
		},
		setPage: (state, action) => {
			state.page = action.payload;
		},
		setLikedOffset: (state, action) => {
			state.likedOffset = action.payload;
		},
		setSort: (state, action) => {
			state.sort = action.payload;
		},
		setSearch: (state, action) => {
			state.search = action.payload;
		},
		setShowFilter: (state, action) => {
			state.showFilter = action.payload;
		}
	},
})

// Action creators are generated for each case reducer function
export const {
	toggleDrawer,
	setOffset,
	setPage,
	setLikedOffset,
	setSort,
	setSearch,
	setShowFilter,
} = navSlice.actions

export const useNav = () => {
	const dispatch = useDispatch();
	const state = useSelector(state => state.nav);

	return {
		...state,
		toggleDrawer: (drawer, open) => dispatch(toggleDrawer({drawer, open})),
		setOffset: payload => dispatch(setOffset(payload)),
		setPage: payload => dispatch(setPage(payload)),
		setLikedOffset: payload => dispatch(setLikedOffset(payload)),
		setSort: payload => dispatch(setSort(payload)),
		setSearch: payload => dispatch(setSearch(payload)),
		setShowFilter: payload => dispatch(setShowFilter(payload)),
	}
}

export default navSlice.reducer
