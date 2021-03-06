import { createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
	user: {},
	roles: [],
	token: '',
	savePath: '',
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
		setSavePath: (state, action) => {
			state.savePath = action.payload;
		},
	},
})

// Action creators are generated for each case reducer function
export const { setUserAction, setToken, setRoles, setSavePath } = authSlice.actions

export const useAuth = () => {
	const dispatch = useDispatch();
	const { user, token, roles, savePath } = useSelector(state => state.auth);

	const canEdit = ( paper ) => {
		return user.id === paper.user_id || roles.includes('god');
	} 
	const canPublish = () => {
		return roles.includes('god');
	} 
	
	return {
		user,
		token,
		roles,
		savePath,
		canEdit,
		canPublish,
		isUser: user && user.id,
		setUser: payload => dispatch(setUserAction(payload)),
		setToken: payload => dispatch(setToken(payload)),
		setRoles: payload => dispatch(setRoles(payload)),
		setSavePath: payload => dispatch(setSavePath(payload)),
	}
}

export default authSlice.reducer
