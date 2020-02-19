import React, { Component } from "react";
import { Post, SocketContext, useStyles } from "../exports";
import { Typography, Chip, List, ListItem, withStyles } from '@material-ui/core';

class FriendsChat extends Component {
  constructor() {
    super();
    this.state = {
      response: [],
      newpost: "",
      error: null,
    };
    this.socket = SocketContext;
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.messagesEndRef = React.createRef()
  }

  componentDidMount() {
    let { response } = this.state;

    

    this.socket.emit("join private", this.props.friendsid)


    this.socket.on('post', (rawPost => {
      var previous = response;
      var newpost = JSON.parse(rawPost);
      previous.push(newpost)
      this.setState({ response: previous });
      
      
    }));

    this.socket.on('error', (err) => {
      this.setState({ error: "-- " + err + " --" });
    });
  }

  scrollToBottom = () => {
    this.messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
  }

  componentDidUpdate(){
    this.scrollToBottom()
  }

  componentWillUnmount() {
    this.socket.emit("leave private", this.props.friendsid)
  }

  render() {
    const { response, error } = this.state;
    let showposts = null;

    if (response.length === 0 || response == null || typeof response != "object") {
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