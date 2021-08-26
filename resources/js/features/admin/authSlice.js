import { createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
	user: {},
	roles: [],
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
		setRoles: (state, action) => {
			state.roles = action.payload;
		},
	},
})

// Action creators are generated for each case reducer function
export const { setUserAction, setToken, setRoles } = authSlice.actions

export const useAuth = () => {
	const dispatch = useDispatch();
	const { user, token, roles } = useSelector(state => state.auth);

	const canEdit = ( paper ) => {
		return user.id === paper.user_id || roles.includes('god');
	} 
	
	return {
		user,
		token,
		roles,
		canEdit,
		isUser: user && user.id,
		setUser: payload => dispatch(setUserAction(payload)),
		setToken: payload => dispatch(setToken(payload)),
		setRoles: payload => dispatch(setRoles(payload)),
	}
}

export default authSlice.reducer
