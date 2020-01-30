import React, { Component } from "react";
import SocketContext from '../other/SocketContext'

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
            <div class="form-group">
                <label class="sr-only" for="postContent">Write down your thoughts...</label>
                <textarea class="form-control" id="postContent" placeholder="Write down your thoughts..."
                        rows="3" value={this.state.newpost} onChange={this.handleChange}></textarea>
            </div>

            <button class="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
        </form>       

    );
  }
}

export default NewCommentForm;