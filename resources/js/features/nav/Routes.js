import React from "react";
import {
    Switch,
    Route,
} from "react-router-dom";
import PaperBrowser from "../paper/PaperBrowser";
import UserLiked from "../paper/UserLiked";
import AllTags from "../tagged/AllTags";
import AllCreators from "../creators/AllCreators";
import Slideshow from "../paper/Slideshow";

const PaperRoutes = (props) => {
    return (
        <Switch>
            <Route exact path="/">
                <PaperBrowser />
            </Route>
            <Route path="/play">
                <Slideshow />
            </Route>
            <Route path="/tags">
                <AllTags />
            </Route>
            <Route path="/creators">
                <AllCreators />
            </Route>
            <Route path="/liked">
                <UserLiked />
            </Route>
        </Switch>
    )
}

export default PaperRoutes;
