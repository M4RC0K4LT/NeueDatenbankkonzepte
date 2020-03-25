import React, { Component } from 'react';
import {  Redirect, Link } from 'react-router-dom';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, withStyles, Badge, Container, IconButton, Typography } from '@material-ui/core';
import { Chat as ChatIcon } from '@material-ui/icons';
import { useStyles, SocketContext } from '../exports'

//Styling of green dot next to profilePicture to show that user is online
const StyledBadge = withStyles(theme => ({
    badge: {
      backgroundColor: '#44b700',
      color: '#44b700',
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      '&::after': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        animation: '$ripple 1.2s infinite ease-in-out',
        border: '1px solid currentColor',
        content: '""',
      },
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(.8)',
        opacity: 1,
      },
      '100%': {
        transform: 'scale(2.4)',
        opacity: 0,
      },
    },
}))(Badge);

/** ShowFollowedUsers Component to provide a sidebar with all followed users */
class ShowFollowedUsers extends Component {

    //Initialize state values and socket
    constructor(props){
        super(props);
        this.state = {
            allfriends: [],
            redirect: false,
            selected: null,
        };  
        this.socket = SocketContext;
    }
    
    //Start socket listeners
    componentDidMount(){
        this.socket.emit("getMyFriends");

        this.socket.on("returnFriend", (rawData => {
            let { allfriends } = this.state;
            let previous = allfriends;
            let newfriend = JSON.parse(rawData);
            if(newfriend.id==="-1"){
                previous.push(newfriend)
            }else {
                previous.unshift(newfriend)
            }
            this.setState({ allfriends: previous });
        }))

        this.socket.on("removeFriend", (id) => {
            let { allfriends } = this.state;
            let todelete = null;
            for (var i = 0; i < allfriends.length; i++) {
                if(allfriends[i].id === id){
                  todelete = i;
                  break
                }
            }
            delete allfriends[todelete];
            this.setState({ allfriends: allfriends });
        })

        this.socket.on("goesonline", (rawData => {
            let { allfriends } = this.state;
            for (var i = 0; i < allfriends.length; i++) {
                if(allfriends[i].id === rawData){
                  allfriends[i].online = 1;
                  this.setState({ allfriends });
                  break
                }
            }
        }))

        this.socket.on("goesoffline", (rawData => {
            let { allfriends } = this.state;
            for (var i = 0; i < allfriends.length; i++) {
                if(allfriends[i].id === rawData){
                  allfriends[i].online = 0;
                  this.setState({ allfriends });
                  break
                }
            }
        }))

        this.socket.on("newmessageread", (id => {
            let { allfriends } = this.state;
            for (var i = 0; i < allfriends.length; i++) {
                if(allfriends[i].id === id){
                  allfriends[i].newmessage = 0;
                  this.setState({ allfriends });
                  break
                }
            }
        }))

        this.socket.on("newmessage", (id => {
            let { allfriends } = this.state;
            for (var i = 0; i < allfriends.length; i++) {
                if(allfriends[i].id === id){
                  allfriends[i].newmessage = 1;
                  this.setState({ allfriends });
                  break
                }
            }
        }))

        this.socket.on('error', (err) => {
            console.log(err);
          });
    }

    //Stop socket listeners
    componentWillUnmount(){
        this.socket.off("returnFriend");
        this.socket.off("removeFriend")
        this.socket.off("goesonline");
        this.socket.off("goesoffline");
        this.socket.off("newmessageread");
        this.socket.off("newmessage");
    }

    render() {
        let { classes } = this.props 

        if(this.state.redirect){
            return(<Redirect to={"/profile/" + this.state.selected}></Redirect>)
        }
        return (
            <Container className={classes.onlineFriends} style={{ display: this.state.allfriends.length===0 ? "none" : "block" }}>
                <Typography variant="h6">Following</Typography><br/>
                <List>
                    {this.state.allfriends.map((value, i) => {
                        return (
                        <ListItem key={i} button component={Link} style={{ color: "inherit" }} to={"/profile/" + value.id}>
                            <ListItemAvatar>
                                <StyledBadge
                                    overlap="circle"
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    variant="dot"
                                    invisible={!value.online}
                                >
                                    <Avatar src={window.$apiroute + "/profilePics/user_" + value.id + ".png"} />
                                </StyledBadge>
                            </ListItemAvatar>
                            <ListItemText id={value.id} primary={value.username} />
                            <ListItemSecondaryAction>
                                <IconButton component={Link} to={"/private/" + value.id}>
                                <Badge variant="dot" color="secondary" invisible={value.newmessage === 1 ? false : true}>
                                    <ChatIcon></ChatIcon>
                                </Badge>
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                        );
                    })}
                </List>
            </Container>
        );
    }
}

/**
 * Defines the ShowFollowedUsers Component.
 * Displays a sidebar with followed users
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - ShowFollowedUsers Component
 */
export default withStyles(useStyles) (ShowFollowedUsers);