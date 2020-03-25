import React, { Component } from "react";
import { PersonalFeedPosts, useStyles } from '../components/exports';
import { Backdrop, CircularProgress, withStyles, Typography } from '@material-ui/core';

/** Central PersonalFeed Component contains all needed child components */
class PersonalFeed extends Component {

    //Initialize state variables
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
                <Typography variant="h3" align="center">Personal Feed</Typography>
                <br></br>
                <Typography variant="h4" align="center">The place for your friends posts</Typography>
                <br></br><br></br><hr></hr><br></br><br></br>
                <PersonalFeedPosts startLoading={() => this.setState({ open: true })} endLoading={() => this.setState({ open: false})}></PersonalFeedPosts>
            </div>
        );
    }
}

/**
 * Displays posts of followed users.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - PersonalFeed Component
 */
export default withStyles(useStyles) (PersonalFeed);