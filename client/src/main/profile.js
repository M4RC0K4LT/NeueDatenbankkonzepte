import React, { Component } from "react";
import { Container, withStyles, Typography, Grid, Paper, Backdrop, CircularProgress } from '@material-ui/core';
import { useStyles, ProfileFeed, FollowButton, SocketContext, ProfilePicture } from '../components/exports';



var jwtDecode = require('jwt-decode');

class Profile extends Component {

    constructor(props) {
        super(props);
        let token = sessionStorage.getItem("authToken");
        let decoded = jwtDecode(token);
        let tokenuserid = decoded.id;
        this.state = {
            userdata: {},
            myid: tokenuserid,
            open: false
        };
        this.socket = SocketContext;
    }

    componentDidMount() {
        let id = this.props.match.params.id;
        if(id == null){
            id = this.state.myid
        }
        this.socket.emit("getUserData", id);
        this.socket.on("getUserDataReturn", (rawData) => {
            var newdata = JSON.parse(rawData);
            this.setState({ userdata: newdata });
        })
        this.socket.on("addfollower", (id) => {
            const { userdata } = this.state;
            if(userdata.id == id){
                userdata.followers = userdata.followers+1;
                this.setState({ userdata: userdata });
            }
            
        })
        this.socket.on("removefollower", (id) => {
            const { userdata } = this.state;
            if(userdata.id == id){
                userdata.followers = userdata.followers-1;
                this.setState({ userdata: userdata });
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            this.socket.off("getUserDataReturn");
            this.socket.off("addfollower")
            this.socket.off("removefollower");
            this.componentDidMount()
        }
    }

    componentWillUnmount(){
        this.socket.off("getUserDataReturn");
        this.socket.off("addfollower")
        this.socket.off("removefollower");
    }

    render() {

        const { classes } = this.props;

        let userid = this.props.match.params.id

        let followbutton = null;
        let own = true;
        if ((userid != null) && (userid != this.state.myid) && (this.state.userdata.request != "failed")) {
            own = false;
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
                <Backdrop open={this.state.open} className={this.props.classes.backdrop}>
                    <CircularProgress color="inherit" />
                </Backdrop>
                <ProfilePicture userid={userid} own={own}></ProfilePicture>
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
                    id={userid}
                    startLoading={() => this.setState({ open: true })} 
                    endLoading={() => this.setState({ open: false})}>
                </ProfileFeed>
            </Container>
        );
    }
}

export default withStyles(useStyles)(Profile);