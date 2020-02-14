import React, { Component } from "react";
import { Container, withStyles } from '@material-ui/core';
import { useStyles } from '../components/exports'

class Profile extends Component {

  render() {
    return (
      <Container>
          <p>hello</p>
      </Container>
    );
  }
}

export default withStyles(useStyles) (Profile);