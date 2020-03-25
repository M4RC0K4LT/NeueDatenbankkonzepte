import React, { Component } from "react";
import { SocketContext, useStyles } from "../exports";
import { Typography, List, ListItem, withStyles } from '@material-ui/core';

/** FriendsChat Component to provide private Chat between two users */
class FriendsChat extends Component {

  //Initializes state-values and sockets
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

  //Start socket listener
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

  //Scroll down to latest message
  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  //Stop socket listeners on possible route change
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

  //Stop socket listener
  componentWillUnmount() {
    this.socket.off("post");
    this.socket.off("previous posts")
    this.socket.emit("leave private", this.props.friendsid)
  }

  render() {
    const { response, error, loading } = this.state;
    let showposts = null;

    if((response.length === 0 || response === null || typeof response != "object") && (loading === false)){
      showposts = (
        <div>
          <Typography variant="h" align="center">You haven't chated with that user yet</Typography>
          <Typography variant="h6" align="center" ref={this.messagesEndRef}>{error}</Typography>
        </div>
      )
    } else {

      //Provide container without scrollbar
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

/**
 * Defines the FriendsChat Component.
 * Displays private chat between two users
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - FriendsChat Component
 */
export default withStyles(useStyles)(FriendsChat);