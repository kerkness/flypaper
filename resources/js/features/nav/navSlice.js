import { createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
	// drawerOpen: {
	// 	login: false,
	// 	submit: false,
	// 	info: false,
	// 	account: false,
	// },
	login: false,
	submit: false,
	info: false,
	account: false,
// loginOpen: false,
	// submitOpen: false,
	// infoOpen: false,
	// accountOpen: false,
}

export const navSlice = createSlice({
	name: 'nav',
	initialState,
	reducers: {
		toggleDrawer: (state, action) => {
			console.log("toggle", action.payload);
			const { drawer, open } = action.payload;
			state[drawer] = open;
		},
		// openLogin: (state) => {
		// 	state.loginOpen = true;
		// 	state.submitOpen = false;
		// 	state.infoOpen = false;
		// 	state.accountOpen = false;
		// },
		// closeLogin: (state) => {
		// 	state.loginOpen = false;
		// },
		// openSubmit: (state) => {
		// 	state.submitOpen = true;
		// 	state.loginOpen = false;
		// 	state.infoOpen = false;
		// 	state.accountOpen = false;
		// },
		// closeSubmit: (state) => {
		// 	state.submitOpen = false;
		// },
		// openInfo: (state) => {
		// 	state.infoOpen = true;
		// 	state.loginOpen = false;
		// 	state.submitOpen = false;
		// 	state.accountOpen = false;
		// },
		// closeInfo: (state) => {
		// 	state.infoOpen = false;
		// },
		// openAccount: (state) => {
		// 	state.accountOpen = false;
		// 	state.loginOpen = false;
		// 	state.submitOpen = false;
		// 	state.infoOpen = false;
		// },
		// closeAccount: (state) => {
		// 	state.accountOpen = false;
		// }
	},
})

// Action creators are generated for each case reducer function
export const {
	toggleDrawer,
	// openLogin,
	// closeLogin,
	// openSubmit,
	// closeSubmit,
	// openInfo,
	// closeInfo
} = navSlice.actions

export const useNav = () => {
	const dispatch = useDispatch();
	const state = useSelector(state => state.nav);

	return {
		// ...state.drawerOpen,
		...state,
		// drawerOpen: state.drawerOpen,
		toggleDrawer: (drawer, open) => dispatch(toggleDrawer({drawer, open})),
		// openLogin: () => dispatch(openLogin()),
		// closeLogin: () => dispatch(closeLogin()),
		// openSubmit: () => dispatch(openSubmit()),
		// closeSubmit: () => dispatch(closeSubmit()),
		// openInfo: () => dispatch(openInfo()),
		// closeInfo: () => dispatch(closeInfo()),
	}
}

export default navSlice.reducer
