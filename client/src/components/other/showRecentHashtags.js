import React, { Component } from 'react';
import {  Redirect, Link } from 'react-router-dom';
import { List, ListItem, ListItemText, withStyles, Container, Typography, ListItemIcon } from '@material-ui/core';
import { useStyles, SocketContext } from '../exports'

/** ShowRecentHashtags Component to provide a sidebar with top-5 hashtags */
class ShowRecentHashtags extends Component {

    //Initialize state values and socket
    constructor(props){
        super(props);
        this.state = {
            recentTags: [],
        };  
        this.socket = SocketContext;
    }   
    
    //Start socket listener
    componentDidMount(){
        this.socket.emit("get hashtagstats");

        this.socket.on('hashtagstats', (rawPost => {
            let newlist = rawPost.reduce(function(result, value, index, array) {
                if (index % 2 === 0)
                  result.push(array.slice(index, index + 2));
                return result;
            }, []);
            this.setState({ recentTags: newlist.slice(0, 5) });
        }));
    }

    //Stop socket listener
    componentWillUnmount(){
        this.socket.off("hashtagstats");
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
                        <ListItem alignItems="flex-start" key={i} button component={Link} style={{ textDecoration: "none"  }} to={"/hashtags/" + value[0]}>
                            <ListItemIcon style={{ width: "fit-content" }}><div style={{ width: "5px" }}>{i+1 + "."}</div></ListItemIcon> 
                            <ListItemText id={value.id} style={{ color: "#64b5f6" }} primary={"#" + value[0]} />
                        </ListItem>
                        );
                    })}
                </List>
            </Container>
        );
    }
}

/**
 * Defines the ShowRecentHashtags Component.
 * Displays a sidebar with top-5 hashtags.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - ShowRecentHashtags Component
 */
export default withStyles(useStyles) (ShowRecentHashtags);