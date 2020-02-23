import React, { Component } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, withStyles, Container, Typography } from '@material-ui/core';
import { useStyles, SocketContext } from '../exports'
import {  Redirect, useHistory, Link } from 'react-router-dom';

class ShowRecentHashtags extends Component {

    constructor(props){
        super(props);
        this.state = {
            recentTags: [],
        };  
        this.socket = SocketContext;
    }   

    handleClick(value){
        let path = `/profile/` + value.toString();
        let history = useHistory();
        history.push(path);
    }
    
    componentDidMount(){
        this.socket.emit("get hashtagstats");

        this.socket.on('hashtagstats', (rawPost => {
            let newlist = rawPost.reduce(function(result, value, index, array) {
                if (index % 2 === 0)
                  result.push(array.slice(index, index + 2));
                return result;
            }, []);
            this.setState({ recentTags: newlist.reverse() });
        }));
    }

    componentWillUnmount(){
        this.socket.removeAllListeners();
    }

    render() {
        let { classes } = this.props 

        if(this.state.redirect){
            return(<Redirect to={"/profile/" + this.state.selected}></Redirect>)
        }
        return (
            <Container className={classes.recentTags}>
                <Typography variant="h6">#Tags</Typography><br/>
                <List>
                    {this.state.recentTags.map((value, i) => {
                        return (
                        <ListItem alignItems="flex-start" key={i} button component={Link} style={{ textDecoration: "none", color: "#64b5f6" }} to={"/hashtags/" + value[0]}>
                            <ListItemText id={value.id} primary={"#" + value[0]} />
                            <ListItemSecondaryAction>
                                {value[1]}
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
export default withStyles(useStyles) (ShowRecentHashtags);