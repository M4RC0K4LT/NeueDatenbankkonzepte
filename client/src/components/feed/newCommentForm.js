import React, { Component } from "react";
import { SocketContext } from '../exports';
import { TextField, Button } from '@material-ui/core';


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
    this.setState({newpost: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.newpost.length == 0){
      this.setState({ error: true });
      return;
    }
    this.setState({ error: false, newpost: "" })
    this.socket.emit('post', JSON.stringify({/*user: 'CurrentUser', */content: this.state.newpost/*, posted: new Date().toLocaleString(), likes: 0*/}));
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