import React from "react";
import {
    Switch,
    Route,
} from "react-router-dom";
import SubmitPaper from "../submit/SubmitPaper";
import PaperBrowser from "../browser/PaperBrowser";

const PaperRoutes = (props) => {
    return (
        <Switch>
            <Route path="/">
                <PaperBrowser />
            </Route>
        </Switch>
    )
}

export default PaperRoutes;
