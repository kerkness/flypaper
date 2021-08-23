require('./bootstrap');

import React from "react";
import { initializeComponentById } from "./bundler";
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { store } from './store';
import { Provider } from 'react-redux';
import FlyPaperApp from './FlyPaperApp';

const App = (props) => {

    const appTheme = createTheme({
		palette: {
			mode: 'dark',
		}
	});

    return (
        <Provider store={store}>
            <ThemeProvider theme={appTheme}>
                <FlyPaperApp {...props} />
            </ThemeProvider>
        </Provider>
    )
}

initializeComponentById('flypaper-app', App);
