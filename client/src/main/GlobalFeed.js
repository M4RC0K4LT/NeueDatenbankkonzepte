import React, { Component } from "react";
import { Feed, NewCommentForm } from '../components/exports';
import { Box } from '@material-ui/core';

class GlobalFeed extends Component {

  render() {
    return (
      <div>    
        <NewCommentForm></NewCommentForm>
        <Box m={3}></Box>
        <hr></hr>
        <Box m={5}></Box>
        <Feed></Feed>
      </div>
    );
  }
}

export default GlobalFeed;