import React, { Component } from "react";
import { Container, withStyles } from '@material-ui/core';
import { useStyles, ProfileFeed } from '../components/exports';

var jwtDecode = require('jwt-decode');

class Profile extends Component {

  render() {

    let userid = this.props.match.params.id

    let feed = null;
    if(userid == null){
      let token = sessionStorage.getItem("authToken");
      let decoded = jwtDecode(token);
      userid = decoded.id;
    }
    return (
      <Container>
          <ProfileFeed
            id={userid}>
          </ProfileFeed>
      </Container>
    );
  }
}

export default withStyles(useStyles) (Profile);