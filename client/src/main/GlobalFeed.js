import React, { Component } from "react";
import { GlobalFeedPosts, NewCommentForm, useStyles } from '../components/exports';
import { Box, Backdrop, CircularProgress, withStyles } from '@material-ui/core';

class GlobalFeed extends Component {

  constructor() {
    super();
    this.state = {
      open: false,
    };
  }

  render() {
    return (
      <div>
        <Backdrop open={this.state.open} className={this.props.classes.backdrop}>
            <CircularProgress color="inherit" />
        </Backdrop>
        <NewCommentForm></NewCommentForm>
        <Box m={3}></Box>
        <hr></hr>
        <Box m={5}></Box>
        <GlobalFeedPosts startLoading={() => this.setState({ open: true })} endLoading={() => this.setState({ open: false})}></GlobalFeedPosts>
      </div>
    );
  }
}

export default withStyles(useStyles) (GlobalFeed);