import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
	loading: false,
	hasNextPage: true,
	error: false,
	papers: [],
	customSize: { width: '', height: '' },
	crop: 'crop',
	resolution: '16:9',
}

export const categories = [
	{ label: "Standard", slug: "standard" },
	{ label: "Wide", slug: "wide" },
	{ label: "Ultra Wide", slug: "ultra-wide" },
	{ label: "Dual", slug: "dual" },
	{ label: "Triple", slug: "triple" },
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
		removePaper: (state, action) => {
			state.papers = [..._.filter(state.papers, p => p.id !== action.payload.id)];
		},
		updatePaper: (state, action) => {
			state.papers = _.map(state.papers, p => {
				if (p.id === action.payload.id) {
					p[action.payload.field] = action.payload.value;
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
		setLoading: (state, action) => {
			state.loading = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
		setHasNextPage: (state, action) => {
			state.hasNextPage = action.payload;
		},
	},
})

// Action creators are generated for each case reducer function
export const { addPapers, addNewPaper, removePaper, updatePaper, setCustomSize, setCrop, setResolution, setLoading, setError, setHasNextPage } = paperSlice.actions

export const usePaper = () => {
	const dispatch = useDispatch();
	const state = useSelector(state => state.papers);
	return {
		...state,
		addPapers: payload => dispatch(addPapers(payload)),
		addNewPaper: payload => dispatch(addNewPaper(payload)),
		removePaper: payload => dispatch(removePaper(payload)),
		updatePaper: (value, field, id) => dispatch(updatePaper({
			value, field, id
		})),
		setCustomSize: payload => dispatch(setCustomSize(payload)),
		setCrop: payload => dispatch(setCrop(payload)),
		setResolution: payload => dispatch(setResolution(payload)),
		setLoading: payload => dispatch(setLoading(payload)),
		setError: payload => dispatch(setError(payload)),
		setHasNextPage: payload => dispatch(setHasNextPage(payload)),
	}
}

export default paperSlice.reducer
