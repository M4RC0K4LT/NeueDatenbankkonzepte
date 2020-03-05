import React, { Component } from "react";
import { useStyles, SocketContext } from '../exports';
import { TextField, withStyles } from '@material-ui/core';

class NewPrivateMessage extends Component {

    constructor(props){
        super(props);
        this.state = {
            newmessage: "",
            error: false,
        };  
        this.socket = SocketContext;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onKeyPress = this.onKeyPress.bind(this);
    }

    handleChange(event) {
        this.setState({ newmessage: event.target.value });
    }

    onKeyPress(event) {
        if (event.charCode === 13) {
          event.preventDefault();
          this.handleSubmit(event)
        } 
      }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.newmessage.length == 0) {
            this.setState({ error: true });
            return;
        }

        this.socket.emit('new privatepost', JSON.stringify({ friendsid: this.props.friendsid, message: this.state.newmessage }));
        this.setState({ error: false, newmessage: "" });
    }
    
    render() {
        const { classes } = this.props
        return (   
            <TextField
                ref="child"
                id="standard-full-width"
                className={classes.test2}
                style={{ margin: 8, position: "fixed", width: "40%", left: "50%", bottom: "0", marginLeft: "-20%" }}
                placeholder="Schreibe deine Nachricht hier"
                helperText="Neue Nachricht"
                margin="normal"
                InputLabelProps={{
                    shrink: true,
                }}
                onChange={this.handleChange}
                value={this.state.newmessage}
                error={this.state.error}
                onKeyPress={this.onKeyPress}
            />
        );
    }
}

export default withStyles(useStyles) (NewPrivateMessage);