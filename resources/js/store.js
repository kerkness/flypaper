import { configureStore, combineReducers } from '@reduxjs/toolkit';
import navReducer from './features/nav/navSlice';
import authReducer from './features/admin/authSlice';
import submissionReducer from './features/submit/submitSlice';
import paperReducer from './features/paper/paperSlice';

export const store = configureStore({
    reducer: {
        nav: navReducer,
        auth: authReducer,
        submission: submissionReducer,
        papers: paperReducer,
        // uppy: ReduxStore.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['submission/uploadFile'],
                ignoredPaths: ['submission.upload'],
            },
        })
});
