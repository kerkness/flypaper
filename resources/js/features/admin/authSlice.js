import { createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
	user: {},
	token: '',
}

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUserAction: (state, action) => {
			state.user = action.payload;
		},
		setToken: (state, action) => {
			state.token = action.payload;
		},
	},
})

// Action creators are generated for each case reducer function
export const { setUserAction, setToken } = authSlice.actions

export const useAuth = () => {
	const dispatch = useDispatch();
	const { user, token } = useSelector(state => state.auth);
	return {
		user,
		token,
		isUser: user && user.id,
		setUser: payload => dispatch(setUserAction(payload)),
		setToken: payload => dispatch(setToken(payload)),
	}
}

export default authSlice.reducer
