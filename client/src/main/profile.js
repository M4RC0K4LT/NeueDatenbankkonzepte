import React, { Component } from "react";
import { Container, withStyles, Typography } from '@material-ui/core';
import { useStyles, ProfileFeed, FollowButton } from '../components/exports';

var jwtDecode = require('jwt-decode');

class Profile extends Component {

  render() {

    let userid = this.props.match.params.id
    let token = sessionStorage.getItem("authToken");
    let decoded = jwtDecode(token);
    let tokenuserid = decoded.id;

    let followbutton = null;
    if((userid != null) && (userid != tokenuserid)){
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