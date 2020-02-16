import React, { Component } from "react";
import { GlobalFeedPosts, NewCommentForm } from '../components/exports';
import { Box } from '@material-ui/core';

class GlobalFeed extends Component {

  render() {
    return (
      <div>    
        <NewCommentForm></NewCommentForm>
        <Box m={3}></Box>
        <hr></hr>
        <Box m={5}></Box>
        <GlobalFeedPosts></GlobalFeedPosts>
      </div>
    );
  }
}

export default GlobalFeed;