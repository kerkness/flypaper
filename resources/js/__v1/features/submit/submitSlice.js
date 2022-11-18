import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import { categories } from '../paper/paperSlice';

const defaultSubmission = {
	tags: ['MSFS'],
	filename: "",
	source: "",
	mime_type: "",
	size: 0,
	category: "standard",
	ready: false, // Flag to set when we are ready to save
	saved: false,
}

const defaultUppyState = {
	preview: '',
	progress: 0,
	uploading: false,
	fileAdded: false,
	completed: false,
}

const initialState = {
	upload: defaultUppyState,
	submission: defaultSubmission,
	categories: categories,
}

export const submitSlice = createSlice({
	name: 'submission',
	initialState,
	reducers: {
		setFieldValue: (state, action) => {
			state.submission[action.payload.field] = action.payload.value;
		},
		addTag: (state, action) => {
			state.tags = [...state.tags, action.payload]
		},
		removeTag: (state, action) => {
			state.tags = _.filter(state.tags, t => t !== action.payload)
		},
		clearSubmission: (state) => {
			state.submission = defaultSubmission;
			state.upload = defaultUppyState;
		},
		uploadPreview: (state, action) => {
			state.upload.preview = action.payload;
		},
		uploadProgress: (state, action) => {
			state.upload.progress = action.payload;
		},
		uploadStarted: (state) => {
			state.upload.uploading = true;
		},
		uploadCompleted: (state) => {
			state.upload.completed = true;
		},
	},
})

// Action creators are ge nerated for each case reducer function
export const { 
	setFieldValue, 
	addTag, 
	removeTag, 
	clearSubmission, 
	uploadProgress, 
	uploadPreview, 
	uploadStarted, 
	uploadCompleted 
} = submitSlice.actions

export const useSubmission = () => {
	const dispatch = useDispatch();
	const state = useSelector(state => state.submission);
	return {
		...state,
		setFieldValue: (field, value) => dispatch(setFieldValue({field, value})),
		addTag: payload => dispatch(addTag(payload)),
		removeTag: payload => dispatch(removeTag(payload)),
		clearSubmission: () => dispatch(clearSubmission()),
		updateUpload: payload => dispatch(updateUpload(payload)),
		uploadPreview: payload => dispatch(uploadPreview(payload)),
		uploadProgress: payload => dispatch(uploadProgress(payload)),
		uploadStarted: () => dispatch(uploadStarted()),
		uploadCompleted: () => dispatch(uploadCompleted()),
	}
}

export default submitSlice.reducer
