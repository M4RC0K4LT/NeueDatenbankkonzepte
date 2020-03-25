import React, { Component } from "react";
import { GlobalFeedPosts, NewCommentForm, useStyles } from '../components/exports';
import { Box, Backdrop, CircularProgress, withStyles } from '@material-ui/core';

/** GlobalFeed Component to show all public posts */
class GlobalFeed extends Component {

  //Initialize state value
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

/**
 * Defines the GlobalFeed Component which displays all public posts.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - ShowRecentHashtags Component
 */
export default withStyles(useStyles) (GlobalFeed);