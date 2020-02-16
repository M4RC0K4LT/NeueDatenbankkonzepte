import React, { Component } from 'react';
import { withStyles, Button } from '@material-ui/core';
import { useStyles } from "../../exports";
import { postFollow, postUnfollow, postIsFollowing } from "../../../api/exports";

/** LoginFields Component */
class FollowButton extends Component {
    constructor(props){
        super(props);   
        this.state = {
            follow: false,
        }
        this.handleClick = this.handleClick.bind(this)     
    }

    /** Change values (onKeyboardInput) of controlled TextField components */
    handleClick() {
        var { myid, watchedid } = this.props;
        if(this.state.follow === false){
            postFollow(myid, watchedid).then(data => {
                if(data.length<1 || data.request === "failed"){
                    //this.setState({ open: true, snackcolor: "error", message: data.error, disablefields: false })
                    console.log("an error occured")
                }else {
                    this.setState({ follow: true })
                }
            })
        } else {
            postUnfollow(myid, watchedid).then(data => {
                if(data.length<1 || data.request === "failed"){
                    //this.setState({ open: true, snackcolor: "error", message: data.error, disablefields: false })
                    console.log("an error occured")
                }else {
                    this.setState({ follow: false })
                }
            })
        }
    }

    componentDidMount(){
        var { myid, watchedid } = this.props;
        postIsFollowing(myid, watchedid).then(data => {
            if(data.length<1 || data.request === "failed"){
                //this.setState({ open: true, snackcolor: "error", message: data.error, disablefields: false })
                console.log("an error occured")
            }else {
                if(data.result === "true"){
                    this.setState({ follow: true })
                }else {
                    this.setState({ follow: false })
                }
            }
        })
    }

    render(){
        const { follow } = this.state;

        return (
            <Button
                variant="outlined"
                onClick={this.handleClick}
                color="secondary"
            >
                {follow ? 'Unfollow' : 'Follow'}
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
