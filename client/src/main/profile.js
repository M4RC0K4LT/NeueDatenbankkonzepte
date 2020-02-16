import React, { Component } from "react";
import { Container, withStyles } from '@material-ui/core';
import { useStyles, ProfileFeed, FollowButton } from '../components/exports';

var jwtDecode = require('jwt-decode');

class Profile extends Component {

    render() {

        let userid = this.props.match.params.id
        let token = sessionStorage.getItem("authToken");
        let decoded = jwtDecode(token);
        let tokenuserid = decoded.id;

        let followbutton = null;
        if ((userid != null) && (userid != tokenuserid)) {
            followbutton = (
                <FollowButton
                    myid={tokenuserid}
                    watchedid={userid}
                >
                </FollowButton>
            )
        }

        if (userid == null) {
            userid = tokenuserid;
        }

        return (
            <Container>
                <ProfileFeed
                    id={userid}>
                </ProfileFeed>
                {followbutton}
            </Container>
        );
    }
}

export default withStyles(useStyles)(Profile);