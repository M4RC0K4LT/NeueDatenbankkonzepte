import React, { Component } from "react";
import SocketContext from '../other/SocketContext';
import { TextField, Button } from '@material-ui/core';


class NewCommentForm extends Component {
  constructor() {
    super();
    this.state = {
      newpost: "",
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
    this.socket.emit('post', JSON.stringify({content: this.state.newpost}));
  }

  render() {
    return (
        <form>
            <TextField
              id="outlined-multiline-static"
              multiline
              rows="4"
              defaultValue="Default Value"
              variant="outlined"
              placeholder="Write down your thoughts..."
              value={this.state.newpost} 
              fullWidth
              onChange={this.handleChange}
              margin="normal">
            </TextField>

            <Button variant="contained" color="primary" onClick={this.handleSubmit}>Submit</Button>
        </form>       

    );
  }
}

export default NewCommentForm;