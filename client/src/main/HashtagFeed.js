import React, { Component } from "react";
import { HashtagFeedPosts, useStyles } from '../components/exports';
import { Typography, Backdrop, CircularProgress, withStyles } from '@material-ui/core';

/** HashtagFeed Component to display all posts belonging to selected hashtag */
class HashtagFeed extends Component {

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
                <Typography variant="h3" align="center">#{this.props.match.params.tag}</Typography>
                <br></br><br></br><hr></hr><br></br><br></br>
                <HashtagFeedPosts tag={this.props.match.params.tag} startLoading={() => this.setState({ open: true })} endLoading={() => this.setState({ open: false})}></HashtagFeedPosts>
            </div>
        );
    }
}

/**
 * Defines the HashtagFeed Component.
 * Displays all posts belonging to selected hashtag.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - HashtagFeed Component
 */
export default withStyles(useStyles) (HashtagFeed);