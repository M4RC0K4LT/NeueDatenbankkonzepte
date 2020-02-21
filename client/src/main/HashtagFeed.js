import React, { Component } from "react";
import { HashtagFeedPosts } from '../components/exports';
import { Typography } from '@material-ui/core';

class GlobalFeed extends Component {

    render() {
        return (
            <div>
                <Typography variant="h3" align="center">#{this.props.match.params.tag}</Typography>
                <br></br><br></br><hr></hr><br></br><br></br>
                <HashtagFeedPosts tag={this.props.match.params.tag}></HashtagFeedPosts>
            </div>
        );
    }
}

export default GlobalFeed;