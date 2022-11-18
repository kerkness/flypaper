require('./bootstrap');

import React from "react";
import { initializeComponentById } from "./bundler";
import { ThemeProvider, StyledEngineProvider, createTheme, adaptV4Theme } from '@mui/material/styles';
import { store } from './store';
import { Provider } from 'react-redux';
import FlyPaperApp from './FlyPaperApp';
import { PaperLoaderProvider } from "./features/paper/PaperLoader";


const appTheme = createTheme(adaptV4Theme ({
    palette: {
        mode: 'dark',
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#FB7CA5',
        },
    },
}));

// const appTheme = createTheme();

const App = (props) => {

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={appTheme}>
                <Provider store={store}>
                    <PaperLoaderProvider>
                        <FlyPaperApp {...props} />
                    </PaperLoaderProvider>
                </Provider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

initializeComponentById('flypaper-app', App);
