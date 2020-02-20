import React, { Component } from "react";
import { Container, withStyles, Typography, Grid, Paper, Avatar } from '@material-ui/core';
import { useStyles, ProfileFeed, FollowButton } from '../components/exports';
import { getUserInformation } from "../api/exports";



var jwtDecode = require('jwt-decode');

class Profile extends Component {

    constructor(props) {
        super(props);
        let token = sessionStorage.getItem("authToken");
        let decoded = jwtDecode(token);
        let tokenuserid = decoded.id;
        this.state = {
            userdata: {},
            myid: tokenuserid
        };
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        if(id == null){
            id = this.state.myid
        }
        getUserInformation(id).then(data => {
            if (data.length < 1 || data.request === "failed") {
                console.log(data.error)
            } else if (data.posts === 0) {
                data.posts = "Keine Posts"
            }

            this.setState({ userdata: data })
        })
    }

    render() {

        const { classes } = this.props;

        let userid = this.props.match.params.id

        let followbutton = null;
        if ((userid != null) && (userid != this.state.myid) && (this.state.userdata.request != "failed")) {
            followbutton = (
                <FollowButton
                    myid={this.state.myid}
                    watchedid={userid}
                >
                </FollowButton>
            )
        }

        if (userid == null) {
            userid = this.state.myid;
        }

        return (
            <Container >
                <Avatar className={classes.ProfileAvatar} src="https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg"></Avatar>
                <Typography variant="h4" align="center">&nbsp;&nbsp;<b>{this.state.userdata.username}</b>&nbsp;&nbsp;</Typography>
                <br></br><br></br>
                <Grid container spacing={1} justify="center">
                    <Grid item xs={3}>
                        <Paper align="center">
                            <Typography variant="subtitle1">Posts: {this.state.userdata.posts}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <Paper align="center">
                            <Typography variant="subtitle1">Followers: {this.state.userdata.followers}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
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