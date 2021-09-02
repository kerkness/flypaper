import { createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
	tags: [],
	total: 0,
    hasNextPage: true,
}

export const tagSlice = createSlice({
	name: 'tags',
	initialState,
	reducers: {
		addTags: (state, action) => {
			state.tags = [...state.tags, ...action.payload];
		},
        setTotal: (state, action) => {
            state.total = action.payload;
        },
        setHasNextPage: (state, action) => {
            state.hasNextPage = action.payload;
        },
	},
})

// Action creators are generated for each case reducer function
export const { addTags, setTotal, setHasNextPage } = tagSlice.actions

export const useTags = () => {
	const dispatch = useDispatch();
	const state = useSelector(state => state.tags);
	
	return {
        ...state,
		addTags: payload => dispatch(addTags(payload)),
		setTotal: payload => dispatch(setTotal(payload)),
		setHasNextPage: payload => dispatch(setHasNextPage(payload)),
	}
}

export default tagSlice.reducer
