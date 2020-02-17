import React, { Component } from 'react';
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, ListItemSecondaryAction, withStyles, Badge, Container, IconButton, Typography, Divider} from '@material-ui/core';
import { useStyles, SocketContext } from '../exports'
import { Chat as ChatIcon } from '@material-ui/icons';
import { getFriends } from "../../api/exports";
import { Link, Redirect, useHistory } from 'react-router-dom';

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

class ShowFollowedUsers extends Component {

    constructor(props){
        super(props);
        this.state = {
            allfriends: [],
            redirect: false,
            selected: null,
        };  
        this.socket = SocketContext;
    }   

    handleClick(value){
        let path = `/profile/` + value.toString();
        let history = useHistory();
        history.push(path);
    }
    
    componentDidMount(){
        
        getFriends().then(data => {
            if(data.length<1 || data.request === "failed"){
                console.log(data.error)
            }else {
                this.setState({ allfriends: data })
            }
        })

        this.socket.on("goesonline", (rawData => {
            let { allfriends } = this.state;
            for (var i = 0; i < allfriends.length; i++) {
                if(allfriends[i].id == rawData){
                  allfriends[i].online = 1;
                  this.setState({ allfriends });
                  break
                }
            }
        }))

        this.socket.on("goesoffline", (rawData => {
            let { allfriends } = this.state;
            for (var i = 0; i < allfriends.length; i++) {
                if(allfriends[i].id == rawData){
                  allfriends[i].online = 0;
                  this.setState({ allfriends });
                  break
                }
            }
        }))
    }

    render() {
        let { classes } = this.props 

        if(this.state.redirect){
            return(<Redirect to={"/profile/" + this.state.selected}></Redirect>)
        }
        return (
            <Container className={classes.onlineFriends}>
                <Typography variant="h6">Following</Typography><br/>
                <List>
                    {this.state.allfriends.map((value, i) => {
                        return (
                        <ListItem key={i} button component={Link} to={"/profile/" + value.id} divider={true}>
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
                                    <Avatar />
                                </StyledBadge>
                            </ListItemAvatar>
                            <ListItemText id={value.id} primary={value.username} />
                            <ListItemSecondaryAction>
                                <IconButton component={Link} to="/help">
                                <ChatIcon></ChatIcon>
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
 * Defines the RegisterUserForm Component.
 * Displays form for the registration of a new user.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - RegisterUserForm Component
 */
export default withStyles(useStyles) (ShowFollowedUsers);