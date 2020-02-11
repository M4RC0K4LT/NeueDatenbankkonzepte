import React, { Component } from "react";
import Feed from "./components/feed/feed";
import NewCommentForm from "./components/feed/newCommentForm";
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