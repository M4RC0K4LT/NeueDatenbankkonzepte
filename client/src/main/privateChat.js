import React, { Component } from "react";
import { PersonalFeedPosts, NewCommentForm, useStyles, NewPrivateMessage, FriendsChat } from '../components/exports';
import { Box, Typography, Divider, TextField, withStyles } from '@material-ui/core';

class PrivateChat extends Component {

    constructor(props){
        super(props);
        this.state = {
            width: 0
        };  
    }  

    render() {
        const { classes } = this.props
        return (
        <div>    
            <Typography variant="h5" align="center">Chat with your friend</Typography>
            <br></br>
            <br></br>
            <FriendsChat
                friendsid={this.props.match.params.id}>
            </FriendsChat>
            <NewPrivateMessage
                friendsid={this.props.match.params.id}>
            </NewPrivateMessage>
        </div>
        );
    }
}

export default withStyles(useStyles) (PrivateChat);