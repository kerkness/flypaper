import { createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
  loginOpen: false,
  submitOpen: false,
  infoOpen: false,
}

export const navSlice = createSlice({
  name: 'nav',
  initialState,
  reducers: {
    openLogin: (state) => {
      state.loginOpen = true;
      state.submitOpen = false;
      state.infoOpen = false;
    },
    closeLogin: (state) => {
      state.loginOpen = false;
    },
    openSubmit: (state) => {
      state.submitOpen = true;
      state.loginOpen = false;
      state.infoOpen = false;
    },
    closeSubmit: (state) => {
      state.submitOpen = false;
    },
    openInfo: (state) => {
      state.infoOpen = true;
      state.loginOpen = false;
      state.submitOpen = false;
    },
    closeInfo: (state) => {
      state.infoOpen = false;
    },
  },
})

// Action creators are generated for each case reducer function
export const { 
  openLogin, 
  closeLogin, 
  openSubmit, 
  closeSubmit, 
  openInfo, 
  closeInfo 
} = navSlice.actions

export const useNav = () => {
  const dispatch = useDispatch();
  const state = useSelector(state => state.nav);

  return {
    ...state,
    openLogin: () => dispatch(openLogin()),
    closeLogin: () => dispatch(closeLogin()),
    openSubmit: () => dispatch(openSubmit()),
    closeSubmit: () => dispatch(closeSubmit()),
    openInfo: () => dispatch(openInfo()),
    closeInfo: () => dispatch(closeInfo()),
  }
}

export default navSlice.reducer
