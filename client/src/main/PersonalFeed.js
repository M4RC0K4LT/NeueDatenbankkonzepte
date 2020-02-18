import React, { Component } from "react";
import { PersonalFeedPosts, NewCommentForm } from '../components/exports';
import { Box } from '@material-ui/core';

class GlobalFeed extends Component {

  render() {
    return (
      <div>    
        <PersonalFeedPosts></PersonalFeedPosts>
      </div>
    );
  }
}

export default GlobalFeed;