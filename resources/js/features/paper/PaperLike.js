import React, { useEffect, useState } from "react";
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import { Badge } from "@material-ui/core";
import IconButton from "../../components/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { useAuth } from "../admin/authSlice";
import { useNav } from "../nav/navSlice";

const StyledBadge = withStyles((theme) => ({
    badge: {
        // right: 2,
        // top: 2,
        border: `1px solid rgba(200,200,200,0.5)`,
        backgroundColor: `rgba(200,200,200,0.5)`,
        //   padding: '0 4px',
        color: '#FFF',
    },
}))(Badge);

const PaperLike = (props) => {

    const { paper } = props;
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(0);
    const { isUser } = useAuth();
    const { toggleDrawer } = useNav();

    useEffect(() => {

        if (paper.user_liked)
            setLiked(true);

        if (paper.likes_count)
            setCount(paper.likes_count);

    }, [paper])

    const heartPaper = () => {
        if (!isUser) {
            toggleDrawer('login', true);

            return;
        }

        if (liked) recordUnLike();
        if (!liked) recordLike();

        setCount(!liked ? count+1 : count-1)
        setLiked(!liked);

    }

    const recordLike = () => {
        window.api.axiosPost(`/api/paper/${paper.id}/like`)
            .then(response => console.log("like recorded", response))
            .catch(error => console.log("error", error));
    }

    const recordUnLike = () => {
        window.api.axiosDelete(`/api/paper/${paper.id}/like`)
            .then(response => console.log("unlike recorded", response))
            .catch(error => console.log("error", error));
    }

    return (
        <IconButton color={liked ? "secondary" : "default"} onClick={heartPaper}>
            <StyledBadge
                // anchorOrigin={{
                //     vertical: 'center',
                //     horizontal: 'center',
                // }}
                showZero={false}
                badgeContent={count}
                max={99}
                color="default"
            ><FavoriteIcon /></StyledBadge>
        </IconButton>
    )
}

export default PaperLike;
