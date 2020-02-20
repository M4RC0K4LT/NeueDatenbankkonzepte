import React, { Component } from 'react';
import { withStyles, Button } from '@material-ui/core';
import { useStyles } from "../../exports";
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
                    this.setState({ follow: true, color: "darkred", fontSize: 16 })
                }
            })
        } else {
            postUnfollow(myid, watchedid).then(data => {
                if(data.length<1 || data.request === "failed"){
                    //this.setState({ open: true, snackcolor: "error", message: data.error, disablefields: false })
                    console.log("an error occured")
                }else {
                    this.setState({ follow: false, color: "green", fontSize: 20 })
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
                    this.setState({ follow: true, color: "darkred", fontSize: 16 })
                }else {
                    this.setState({ follow: false, color: "green", fontSize: 20 })
                }
            }
        });
        /*getUserInformation(this.props.match.params.id).then(data => {
            if (data.length < 1 || data.request === "failed") {
                console.log(data.error)
            } else if (data.posts === 0) {
                data.posts = "Keine Posts"
            }
            this.setState({ userdata: data })
        })*/
    }

    render(){
        const { follow } = this.state;
        // const { userdata } = this.state;

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
