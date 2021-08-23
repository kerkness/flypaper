import { createSlice } from '@reduxjs/toolkit'
import { useSelector, useDispatch } from 'react-redux';

const initialState = {
  user: {},
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserAction: (state, action) => {
      state.user = action.payload;
    },

  },
})

// Action creators are generated for each case reducer function
export const { setUserAction } = authSlice.actions

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  return {
      user,
      isUser: user && user.id,
      setUser: payload => dispatch(setUserAction(payload)),
  }
}

export default authSlice.reducer
