import React, { Component } from "react";
import { PersonalFeedPosts, useStyles } from '../components/exports';
import { Backdrop, CircularProgress, withStyles, Typography } from '@material-ui/core';

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
                <Typography variant="h3" align="center">Personal Feed</Typography>
                <br></br>
                <Typography variant="h4" align="center">The place for your friends posts</Typography>
                <br></br><br></br><hr></hr><br></br><br></br>
                <PersonalFeedPosts startLoading={() => this.setState({ open: true })} endLoading={() => this.setState({ open: false})}></PersonalFeedPosts>
            </div>
        );
    }
}

export default withStyles(useStyles) (GlobalFeed);