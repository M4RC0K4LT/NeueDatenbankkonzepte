import React, { Component } from "react";
import { SocketContext } from '../exports';
import { TextField, Button } from '@material-ui/core';

var jwtDecode = require('jwt-decode');


class NewCommentForm extends Component {
    constructor() {
        super();
        this.state = {
            newpost: "",
            error: false,
        };
        this.socket = SocketContext;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({ newpost: event.target.value });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.newpost.length == 0) {
            this.setState({ error: true });
            return;
        }

        var token = sessionStorage.getItem("authToken");
        var decoded = jwtDecode(token);

        var userid = decoded.id.toString();
        var username = decoded.name;
        var postDate = Date.now();

        this.socket.emit('new globalpost', JSON.stringify({ content: this.state.newpost, timestamp: postDate, username: username, userid: userid }));
        this.setState({ error: false, newpost: "" });
    }

    render() {
        return (
            <form>
                <TextField
                    id="outlined-multiline-static"
                    multiline
                    error={this.state.error}
                    rows="4"
                    variant="outlined"
                    placeholder="Write down your thoughts..."
                    value={this.state.newpost}
                    fullWidth
                    onChange={this.handleChange}
                    margin="normal"
                    autoFocus>
                </TextField>

                <Button variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
            </form>

        );
    }
}

export default NewCommentForm;