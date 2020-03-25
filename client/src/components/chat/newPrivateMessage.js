import React, { Component } from "react";
import { useStyles, SocketContext } from '../exports';
import { TextField, withStyles, InputAdornment } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';

/** NewPrivateMessage Component to send a new message in privat/friends Chat */
class NewPrivateMessage extends Component {

    //Initializes state-values and sockets
    constructor(props){
        super(props);
        this.state = {
            newmessage: "",
            error: false,
            following: true
        };  
        this.socket = SocketContext;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    //Change message input value
    handleChange(event) {
        this.setState({ newmessage: event.target.value });
    }

    //onEnter Listener
    onKeyPress(event) {
        if (event.charCode === 13) {
          event.preventDefault();
          this.handleSubmit(event)
        } 
    }

    //Submit Handler - Send new private message to backend
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.newmessage.length === 0) {
            this.setState({ error: true });
            return;
        }

        this.socket.emit('new privatepost', JSON.stringify({ friendsid: this.props.friendsid, message: this.state.newmessage }));
        this.setState({ error: false, newmessage: "" });
    }

    //Start socket listener
    componentDidMount(){
        this.socket.on("isfollowingReturn", (follows) => {
            if(follows===false){
                this.setState({ following: false, error: true });
            } else {
                this.setState({ following: true, error: false });
            }
        })
        this.socket.emit("isfollowingme", this.props.friendsid)
    }

    componentDidUpdate(prevProps){
        if (this.props.friendsid !== prevProps.friendsid) {
            this.componentDidMount()
        }
    }

    //Stop socket listener
    componentWillUnmount(){
        this.socket.off("isfollowingReturn");
    }
    
    render() {
        const { classes } = this.props
        return (   
            <TextField
                ref="child"
                id="standard-full-width"
                className={classes.test2}
                style={{ margin: 8, position: "fixed", width: "40%", left: "50%", bottom: "0", marginLeft: "-20%" }}
                placeholder="New private message here"
                helperText={this.state.following ? "New message" : "User not following you: He will not receive your message until he is following you"}
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={this.handleChange}
                value={this.state.newmessage}
                error={this.state.error}
                onKeyPress={this.onKeyPress}
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <SendIcon
                          edge="end"
                          cursor="pointer"
                          onClick={(e) => this.handleSubmit(e)}
                        >
                        </SendIcon>
                      </InputAdornment>
                    ),
                }}
            />
        );
    }
}

/**
 * Defines the NewPrivateMessage Component.
 * Provides Textfield and Handlers for new private Message
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - NewPrivateMessage Component
 */
export default withStyles(useStyles) (NewPrivateMessage);