import React, { Component } from "react";
import { GlobalFeedPosts, NewCommentForm, ShowFollowedUsers } from '../components/exports';
import { Box, Grid } from '@material-ui/core';

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