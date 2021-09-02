import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
	hasNextPage: true,
	error: false,
	liked: [],
	hasNextLikedPage: true,
	papers: [],
	customSize: { width: '', height: '' },
	crop: 'crop',
	resolution: 'default',
}

export const categories = [
	{ label: "Standard - 16:9", slug: "standard" },
	{ label: "Wide - 21:9", slug: "wide" },
	{ label: "Ultra Wide - 32:9", slug: "ultra-wide" },
	{ label: "Dual Monitor", slug: "dual" },
	{ label: "Triple Monitor", slug: "triple" },
];


export const paperSlice = createSlice({
	name: 'papers',
	initialState,
	reducers: {
		addPapers: (state, action) => {
			state.papers = [...state.papers, ...action.payload];
		},
		addNewPaper: (state, action) => {
			state.papers = [action.payload, ...state.papers];
		},
		addLikedPapers: (state, action) => {
			state.liked = [...state.liked, ...action.payload];
		},
		addNewLikedPaper: (state, action) => {
			state.liked = [action.payload, ...state.liked];
		},
		removePaper: (state, action) => {
			state.papers = [..._.filter(state.papers, p => p.id !== action.payload.id)];
		},
		removeAllPaper: (state, action) => {
			state.papers = [];
		},
		updatePaper: (state, action) => {
			state.papers = _.map(state.papers, p => {
				if (p.id === action.payload.id) {
					return action.payload.paper;
				}
				return p;
			});
		},
		setCustomSize: (state, action) => {
			state.customSize = action.payload;
		},
		setCrop: (state, action) => {
			state.crop = action.payload;
		},
		setResolution: (state, action) => {
			state.resolution = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
		setHasNextPage: (state, action) => {
			state.hasNextPage = action.payload;
		},
		setHasNextLikedPage: (state, action) => {
			state.hasNextLikedPage = action.payload;
		},
	},
})

// Action creators are generated for each case reducer function
export const {
	addPapers,
	addNewPaper,
	addLikedPapers,
	addNewLikedPaper,
	removePaper,
	removeAllPaper,
	updatePaper,
	setCustomSize,
	setCrop,
	setResolution,
	setError,
	setHasNextPage,
	setHasNextLikedPage,
} = paperSlice.actions

export const usePaper = () => {
	const dispatch = useDispatch();
	const state = useSelector(state => state.papers);
	return {
		...state,
		addPapers: payload => dispatch(addPapers(payload)),
		addNewPaper: payload => dispatch(addNewPaper(payload)),
		addLikedPapers: payload => dispatch(addLikedPapers(payload)),
		addNewLikedPaper: payload => dispatch(addNewLikedPaper(payload)),
		removePaper: payload => dispatch(removePaper(payload)),
		removeAllPaper: () => dispatch(removeAllPaper()),
		updatePaper: (paper, id) => dispatch(updatePaper({
			paper, id
		})),
		setCustomSize: payload => dispatch(setCustomSize(payload)),
		setCrop: payload => dispatch(setCrop(payload)),
		setResolution: payload => dispatch(setResolution(payload)),
		setError: payload => dispatch(setError(payload)),
		setHasNextPage: payload => dispatch(setHasNextPage(payload)),
		setHasNextLikedPage: payload => dispatch(setHasNextLikedPage(payload)),
	}
}

export default paperSlice.reducer
