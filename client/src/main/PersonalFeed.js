import React, { Component } from "react";
import { PersonalFeedPosts, NewCommentForm } from '../components/exports';
import { Box, Typography } from '@material-ui/core';

class GlobalFeed extends Component {

  render() {
    return (
      <div>    
        <Typography variant="h3" align="center">Personal Feed</Typography>
          <br></br>
          <Typography variant="h4" align="center">The place for your friends posts</Typography>
          <br></br><br></br><hr></hr><br></br><br></br>
        <PersonalFeedPosts></PersonalFeedPosts>
      </div>
    );
  }
}

export default GlobalFeed;