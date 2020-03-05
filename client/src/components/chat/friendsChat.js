import React, { Component } from "react";
import { Post, SocketContext, useStyles } from "../exports";
import { Typography, Chip, List, ListItem, withStyles } from '@material-ui/core';

class FriendsChat extends Component {
  constructor() {
    super();
    this.state = {
      response: [],
      error: null,
      loading: false,
    };
    this.socket = SocketContext;
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.messagesEndRef = React.createRef()
  }

  componentDidMount() { 

    this.props.startLoading();
    this.setState({ loading: true })
    this.socket.emit("join private", this.props.friendsid)

    this.socket.on('post', ((rawPost) => {
      var previous = this.state.response;
      var newpost = JSON.parse(rawPost);
      previous.push(newpost)
      this.setState({ response: previous });  
    }));

    this.socket.on('previous posts', ((rawPost) => {
      this.props.endLoading()
      this.setState({ loading: false })
      this.setState({ response: rawPost });
    }));

    this.socket.on('error', (err) => {
      this.setState({ error: "-- " + err + " --" });
    });
  }

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  componentDidUpdate(prevProps){
    if (this.props.friendsid !== prevProps.friendsid) {
      this.socket.off("post");
      this.socket.off("previous posts")
      this.socket.emit("leave private", prevProps.friendsid)
      this.setState({ response: [] })
      this.componentDidMount()   
    } else {
      this.scrollToBottom()
    }
  }

  componentWillUnmount() {
    this.socket.off("post");
    this.socket.off("previous posts")
    this.socket.emit("leave private", this.props.friendsid)
  }

  render() {
    const { response, error, loading } = this.state;
    let showposts = null;

    if((response.length === 0 || response == null || typeof response != "object") && (loading == false)){
      showposts = (
        <div>
          <Typography variant="h" align="center">You haven't chated with that user yet</Typography>
          <Typography variant="h6" align="center" ref={this.messagesEndRef}>{error}</Typography>
        </div>
      )
    } else {

      showposts = (
        <div style={{ height: "600px", width: "100%", overflow: "hidden" }}>
          <List style={{ height: "100%", width: "100%", overflow: "auto", paddingRight: "18px", boxSizing: "content-box" }}>
            {response.map((data, i) => {        
              return (
                <ListItem key={i} style={{ display: "flex" }}>
                  <div className={this.props.classes.privateMessage} style={{ marginLeft: ((data.sender === this.props.friendsid) ? "0" : "auto") }}><div className={this.props.classes.privateMessageText}>{data.message}</div></div>
                </ListItem>)
            })}
          <div ref={this.messagesEndRef}></div>
          </List>
          
        </div>)
    }

    return showposts;
  }
}

export default withStyles(useStyles)(FriendsChat);