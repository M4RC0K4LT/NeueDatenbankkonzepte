import React, { Component } from 'react';
import { withStyles, Button } from '@material-ui/core';
import { useStyles, SocketContext } from "../../exports";
import { postFollow, postUnfollow, postIsFollowing, getUserInformation } from "../../../api/exports";

/** LoginFields Component */
class FollowButton extends Component {
    constructor(props){
        super(props);   
        this.state = {
            follow: false,
            fontColor: "white",
            width: "100%",
            userdata: {},
        };
        
        this.handleClick = this.handleClick.bind(this);
        this.socket = SocketContext;
    }

    /** Change values (onKeyboardInput) of controlled TextField components */
    handleClick() {
        var {  watchedid } = this.props;
        if(this.state.follow === false){
            this.socket.emit("follow", watchedid);
            this.setState({ follow: true, color: "darkred", fontSize: 16 });
        } else {
            this.socket.emit("unfollow", watchedid);
            this.setState({ follow: false, color: "green", fontSize: 16 });
        }
    }

    componentDidMount(){
        var { watchedid } = this.props;
        this.socket.emit("isfollowing", watchedid);
        this.socket.on("isfollowingReturn", (bool => {
            if(bool == true){
                this.setState({ follow: true, color: "darkred", fontSize: 16 })
            } else {
                this.setState({ follow: false, color: "green", fontSize: 16 });
            }
        }))
    }

    componentWillUnmount(){
        this.socket.off("isfollowingReturn");
    }

    render(){
        const { follow } = this.state;

        return (
            <Button
                variant="outlined"
                onClick={this.handleClick}
                style={{background: this.state.color, width: this.state.width, fontSize: this.state.fontSize, color: this.state.fontColor}}
            >
                {follow ? 'Unfollow' + ' User ' + this.props.watchedid : 'Follow' + ' User ' + this.props.watchedid}
            </Button>
        )
    }
}

/**
 * Defines the LoginFields Component.
 * Shows all Fields needed for UserLogin
 * @param {props} props - Given properties of mother component (styling, TextField props,...)
 * @return {Component} - LoginFields Component
 */
export default withStyles(useStyles) (FollowButton);
