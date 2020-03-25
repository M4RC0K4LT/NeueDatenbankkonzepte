import React, { Component } from "react";
import { useStyles, NewPrivateMessage, FriendsChat } from '../components/exports';
import { Typography, withStyles, Backdrop, CircularProgress } from '@material-ui/core';

/** Displays the PrivateChat page with all its components */
class PrivateChat extends Component {

    //Initialize state values and socket
    constructor(props){
        super(props);
        this.state = {
            width: 0,
            open: false
        };  
    }  

    render() {
        const { classes } = this.props
        return (
        <div>    
            <Backdrop open={this.state.open} className={classes.backdrop}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Typography variant="h5" align="center">Chat with your friend</Typography>
            <br></br>
            <br></br>
            <FriendsChat  
                startLoading={() => this.setState({ open: true })} 
                endLoading={() => this.setState({ open: false})}
                friendsid={this.props.match.params.id}>
            </FriendsChat>
            <NewPrivateMessage
                friendsid={this.props.match.params.id}>
            </NewPrivateMessage>
        </div>
        );
    }
}

/**
 * Defines the PrivateChat Component.
 * Displays private chat with a single user.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - PrivateChat Component
 */
export default withStyles(useStyles) (PrivateChat);