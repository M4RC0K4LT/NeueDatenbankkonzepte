import React, { Component } from "react";
import { Post, SocketContext } from "../exports";
import { Typography } from '@material-ui/core';

class GlobalFeedPosts extends Component {
  constructor() {
    super();
    this.state = {
      response: [],
      newpost: "",
      error: null,
    };
    this.socket = SocketContext;
  }

  componentDidMount() {
    let { response } = this.state;

    this.socket.emit("join", "global")


    this.socket.on('post', (rawPost => {
      var previous = response;
      var newpost = JSON.parse(rawPost);
      previous.unshift(newpost)
      this.setState({ response: previous });
    }));

    this.socket.on('error', (err) => {
      this.setState({ error: "-- "+err+" --" });
    });

    this.socket.on("newlike", (postid) => {
      for (var i = 0; i < response.length; i++) {
        if(response[i].postid == postid){
          response[i].likes = parseInt(response[i].likes)+1;
          this.setState({ response });
          break
        }
      }
    }) 
    
    this.socket.on("removelike", (postid) => {
      for (var i = 0; i < response.length; i++) {
        if(response[i].postid == postid){
          response[i].likes = parseInt(response[i].likes)-1;
          this.setState({ response });
          break
        }
      }
    }) 
  }

  handleLike(id, number) {
    let { response } = this.state;
    if(response[number].liked){
      this.socket.emit("removelike", id);
    }else{
      this.socket.emit("like", id);
    }
    response[number].liked = !response[number].liked;
    this.setState({ response }); 
  }

  componentWillUnmount(){
    this.socket.emit("leave", "global")
  }

  render() {
    const { response, error } = this.state;
    let showposts = null;
    
    if(response.length === 0 || response == null || typeof response != "object" ){
      showposts = (
        <div>
          <Typography variant="h4">No Posts :/</Typography>
          <Typography variant="subtitle1">There are no posts, yet! Maybe you should enter your thoughts here...</Typography>
          <Typography variant="h6">{error}</Typography>
        </div>
      )
    } else {

      showposts = (
        <div>
          {response.map((data, i)=> {
            return(
            <Post 
              key={i}
              content={data.content}
              likes={parseInt(data.likes)}
              liked={data.liked}
              postid={data.postid}
              username={data.username}
              userid={data.userid}
              timestamp={data.timestamp}
              handleLike={() => this.handleLike(data.postid, i)}
              >
            </Post>  )       
          })}
      </div>)
    }
        
    return showposts;
  }
}

export default GlobalFeedPosts;