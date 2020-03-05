import React, { Component } from "react";
import { useStyles, NewPrivateMessage, FriendsChat } from '../components/exports';
import { Typography, withStyles, Backdrop, CircularProgress } from '@material-ui/core';

class PrivateChat extends Component {

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

export default withStyles(useStyles) (PrivateChat);