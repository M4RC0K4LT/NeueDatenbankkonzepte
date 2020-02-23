import React, { Component } from "react";
import { Post, SocketContext, useStyles } from "../exports";
import { Typography, withStyles } from '@material-ui/core';

class GlobalFeedPosts extends Component {
  constructor() {
    super();
    this.state = {
      response: [],
      newpost: "",
      error: null,
      loading: false,
    };
    this.socket = SocketContext;
  }

  componentDidMount() {
   
    this.socket.emit("join", "global")
    this.props.startLoading();
    this.setState({ loading: true })

    
    this.socket.on('post', (rawPost => {
      var previous = this.state.response;
      var newpost = JSON.parse(rawPost);
      previous.unshift(newpost)
      this.setState({ response: previous });
    }));

    this.socket.on('previous posts', ((rawPost) => {
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
        if(response[i].postid == postid){
          response[i].likes = parseInt(response[i].likes)+1;
          this.setState({ response });
          break
        }
      }
    }) 
    
    this.socket.on("removelike", (postid) => {
      let { response } = this.state;
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
    this.socket.removeAllListeners();
    this.socket.emit("leave", "global")
  }

  render() {
    const { response, error, loading } = this.state;
    let showposts = null;
    
    if((response.length === 0 || response == null || typeof response != "object") && (loading == false)){
      showposts = (
        <div>
          <Typography variant="h3" align="center">All posts for you</Typography>
          <br></br>
          <Typography variant="h4" align="center">What people have to show</Typography>
          <br></br><br></br><hr></hr><br></br>
          <Typography variant="h4" align="center">Sorry - There are no posts :/</Typography>
          <Typography variant="subtitle1" align="center">There are no posts, yet! Maybe you should enter your thoughts here...</Typography>
          <Typography variant="h6" align="center">{error}</Typography>
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
              picture={data.picture}
              handleLike={() => this.handleLike(data.postid, i)}
              >
            </Post>  )       
          })}
      </div>)
    }
        
    return showposts;
  }
}

export default withStyles(useStyles) (GlobalFeedPosts);