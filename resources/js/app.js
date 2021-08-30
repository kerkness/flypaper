require('./bootstrap');

import React from "react";
import { initializeComponentById } from "./bundler";
// import { ThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider, createTheme } from '@material-ui/core/styles'
import { store } from './store';
import { Provider } from 'react-redux';
import FlyPaperApp from './FlyPaperApp';

const appTheme = createTheme({
    palette: {
        // type: 'dark',
        mode: 'dark',
    },
});

// const appTheme = createTheme();

const App = (props) => {

    return (
        <ThemeProvider theme={appTheme}>
            <Provider store={store}>
                <FlyPaperApp {...props} />
            </Provider>
        </ThemeProvider>
    )
}

initializeComponentById('flypaper-app', App);
