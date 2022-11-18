import { createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
	creators: [],
	total: 0,
    hasNextPage: true,
}

export const creatorSlice = createSlice({
	name: 'creators',
	initialState,
	reducers: {
		addCreators: (state, action) => {
			state.creators = [...state.creators, ...action.payload];
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
export const { addCreators, setTotal, setHasNextPage } = creatorSlice.actions

export const useCreators = () => {
	const dispatch = useDispatch();
	const state = useSelector(state => state.creators);
	
	return {
        ...state,
		addCreators: payload => dispatch(addCreators(payload)),
		setTotal: payload => dispatch(setTotal(payload)),
		setHasNextPage: payload => dispatch(setHasNextPage(payload)),
	}
}

export default creatorSlice.reducer
