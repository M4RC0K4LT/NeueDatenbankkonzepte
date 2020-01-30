import React, { Component } from "react";
import SocketContext from '../other/SocketContext'
import Post from "./post"

class Feed extends Component {
  constructor() {
    super();
    this.state = {
      response: [],
      newpost: "",
    };
    this.socket = SocketContext;
  }

  componentDidMount() {

    this.socket.on('previous posts', (rawPost => {
      var newresponse = JSON.parse(rawPost)
      var newresponsearray = Object.values(newresponse);
      newresponsearray.reverse()
      this.setState({ response: newresponsearray});
    }));

    this.socket.on('post', (rawPost => {
      var previous = this.state.response;
      var newresponse = JSON.parse(rawPost)
      previous.unshift(newresponse)
      this.setState({ response: previous });
    }));
  }

  render() {
    const { response } = this.state;
    let showposts = null;
    
    if(response.length === 0 || response == null || typeof response != "object" ){
      showposts = (
        <div class="container">
          <h1 class="mt-5">No Posts :/</h1>
          <p class="lead">There are no posts, yet! Maybe you should enter your thoughts here...</p>
        </div>
      )
    } else {
      showposts = (
        response.map((data)=> (
          <Post post={data}></Post>
      )))
    }
        
    return showposts;
  }
}

export default Feed;