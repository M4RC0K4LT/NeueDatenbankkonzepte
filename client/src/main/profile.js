import React, { Component } from "react";
import { Container, withStyles, Typography, Grid, Paper } from '@material-ui/core';
import { useStyles, ProfileFeed, FollowButton } from '../components/exports';
import { getUserInformation } from "../api/exports";



var jwtDecode = require('jwt-decode');

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userdata: {},
        };
    }

    componentDidMount() {
        getUserInformation(this.props.match.params.id).then(data => {
            if (data.length < 1 || data.request === "failed") {
                console.log(data.error)
            } else if (data.posts === 0) {
                data.posts = "Keine Posts"
            }

            this.setState({ userdata: data })
        })
    }

    render() {

        let userid = this.props.match.params.id
        let token = sessionStorage.getItem("authToken");
        let decoded = jwtDecode(token);
        let tokenuserid = decoded.id;

        let followbutton = null;
        console.log(this.state.userdata)
        if ((userid != null) && (userid != tokenuserid) && (this.state.userdata.request != "failed")) {
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
                <Typography variant="h4" align="center">What &nbsp;&nbsp;<b>{this.state.userdata.username}</b>&nbsp;&nbsp; had to show</Typography>
                <br></br><br></br>
                <Grid container spacing={1} justify="center">
                    <Grid item xs={2}>
                        <Paper align="center">
                        <Typography variant="subtitle1">Posts: {this.state.userdata.posts}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={2}>
                        <Paper align="center">
                            <Typography variant="subtitle1">Followers: {this.state.userdata.followers}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={2}>
                        <Paper align="center">
                            <Typography variant="subtitle1">Following: {this.state.userdata.following}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <br></br><br></br>
                {followbutton}
                <br></br><br></br>
                <ProfileFeed
                    id={userid}>
                </ProfileFeed>
            </Container>
        );
    }
}

export default withStyles(useStyles)(Profile);