import React, { Component } from "react";
import { Post, SocketContext } from "../exports";
import { Typography } from '@material-ui/core';

/** HashhtagFeedPosts Component to provide a feed of one selected hashtag */
class HashtagFeedPosts extends Component {

  //Initialize state variables and socket
  constructor() {
    super();
    this.state = {
      response: [],
      newpost: "",
      error: null,
      loading: false
    };
    this.socket = SocketContext;
    this.handleLike = this.handleLike.bind(this);
  }

  //Handle post like
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

  //Start socket listeners
  componentDidMount() { 
    this.setState({ loading: true })
    this.props.startLoading();
    this.socket.emit("join hashtag", this.props.tag)

    this.socket.on('post', (rawPost => {
      var previous = this.state.response;
      var newpost = JSON.parse(rawPost);
      previous.unshift(newpost)
      this.setState({ response: previous });
    }));

    this.socket.on('previous posts', (rawPost => {
      this.props.endLoading()
      this.setState({ loading: false })
      this.setState({ response: rawPost });
    }));

    this.socket.on('error', (err) => {
      this.setState({ error: "-- "+err+" --" });
    });

    this.socket.on("newlike", (postid) => {
      let { response } = this.state;
      for (var i = 0; i < response.length; i++) {
        if(response[i].postid === postid){
          response[i].likes = parseInt(response[i].likes)+1;
          this.setState({ response });
          break
        }
      }
    }) 
    
    this.socket.on("removelike", (postid) => {
      let { response } = this.state;
      for (var i = 0; i < response.length; i++) {
        if(response[i].postid === postid){
          response[i].likes = parseInt(response[i].likes)-1;
          this.setState({ response });
          break
        }
      }
    }) 
  }

  //Stop socket listeners on page update with different data
  componentDidUpdate(prevProps) {
    if (this.props.tag !== prevProps.tag) {
      this.socket.off("post");
      this.socket.off("previous posts")
      this.socket.off("newlike");
      this.socket.off("removelike")
      this.socket.emit("leave hashtag", prevProps.tag);
      this.componentDidMount()
    }
  }

  //Stop socket listeners
  componentWillUnmount(){
    this.socket.off("post");
    this.socket.off("previous posts")
    this.socket.off("newlike");
    this.socket.off("removelike")
    this.socket.emit("leave hashtag", this.props.tag);
  }

  render() {
    const { response, error, loading } = this.state;
    let showposts = null;
    
    if((response.length === 0 || response === null || typeof response != "object") && (loading === false)){
      showposts = (
        <div>
          <Typography variant="h4"align="center">Sorry - no posts for this hashtag :/</Typography>
          <br></br>
          <Typography variant="subtitle1" align="center">Be the first one!</Typography>
          <Typography variant="h6" align="center">{error}</Typography>
        </div>
      )
    } else {

      showposts = (
        <div>
          {response.map((data, i)=> (
            <Post 
              key={i}
              content={data.content}
              likes={parseInt(data.likes)}
              liked={data.liked}
              postid={data.postid}
              username={data.username}
              userid={data.userid}
              timestamp={data.timestamp}
              picture={data.picture}
              handleLike={() => this.handleLike(data.postid, i)}>
            </Post>         
        ))}
      </div>)
    }
        
    return showposts;
  }
}

/**
 * Defines the HashtagFeedPosts Component.
 * Displays posts one selected hashtag
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - HashtagFeedPosts Component
 */
export default HashtagFeedPosts;