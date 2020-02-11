import React, { Component } from "react";
import SocketContext from '../other/SocketContext';
import Post from "./post";
import { Typography } from '@material-ui/core';

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
        <div>
          <Typography variant="h4">No Posts :/</Typography>
          <Typography variant="subtitle1">There are no posts, yet! Maybe you should enter your thoughts here...</Typography>
        </div>
      )
    } else {
      showposts = (
        <div>
          {response.map((data, i)=> (
            <Post key={i} post={data}></Post>
          ))}
      </div>)
    }
        
    return showposts;
  }
}

export default Feed;