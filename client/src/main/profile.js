import React, { Component } from "react";
import { Container, withStyles, Typography } from '@material-ui/core';
import { useStyles, ProfileFeed, FollowButton } from '../components/exports';
import { getUserInformation } from "../api/exports";

var jwtDecode = require('jwt-decode');

class Profile extends Component {

  constructor(props){
    super(props);
    this.state = {
        userdata: {},
    }; 
}   

  componentDidMount(){
    getUserInformation(this.props.match.params.id).then(data => {
      if(data.length<1 || data.request === "failed"){
          console.log(data.error)
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
    if((userid != null) && (userid != tokenuserid) && (this.state.userdata.request != "failed")){
      followbutton = (
        <FollowButton
          myid={tokenuserid}
          watchedid={userid}
        >
        </FollowButton>
      )
    }

    if(userid == null){
      userid = tokenuserid;
    }

    return (
      <Container>
          {this.state.userdata.username}
          {this.state.userdata.posts}
          {this.state.userdata.followers}
          {this.state.userdata.following}
        <Typography variant="h3" align="center">*Nutzer* Feed</Typography>
          <br></br>
          <Typography variant="h4" align="center">What *Nutzer* had to show</Typography>
          <br></br><br></br><hr></hr><br></br><br></br>
          <ProfileFeed
            id={userid}>
          </ProfileFeed>
          {followbutton}
      </Container>
    );
  }
}

export default withStyles(useStyles) (Profile);