import React, { Component } from 'react';
import { Avatar, Button, withStyles, Input, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText, Badge } from '@material-ui/core';
import { useStyles, SnackbarMessage } from '../exports'
import { postProfilePicture } from '../../api/exports'
import SettingsIcon from '@material-ui/icons/Settings';

/** LoginUserForm Component displays form to log in existing user */
class ProfilePicture extends Component {

    //Initializes TextField values and error handling
    constructor(props){
        super(props);
        this.state = {
            openUpload: false,
            open: false,
            message: "",
            snackcolor: "error",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        
    }   

    uploadImage () {
        var form = document.getElementById("myform");
        var formData = new FormData(form);
        postProfilePicture(formData).then(data => {
            if(data.length<1 || data.request === "failed"){
                this.setState({ snackcolor: "error", message: data.error, open: true })
            }else {
                this.setState({ snackcolor: "success", message: "Successfully updated profile picture!", open: true, openUpload: false })
            }
        })
      }

    
    //Submit provided login data
    handleSubmit(event){ 
        event.preventDefault();
    };

    render() {
        
        const { classes, userid, own } = this.props;
        let settings = null;
        if(own){
            settings = <SettingsIcon style={{ position: "absolute", top: 0, right: 0 }} onClick={() => this.setState({ openUpload: true })}></SettingsIcon>
        }

        return (
            <div style={{ position: "relative" }}>
                {settings}
                <Avatar className={classes.ProfileAvatar} src={window.$apiroute + "/profilePics/user_" + userid + ".png"}></Avatar>
                <Dialog
                    open={this.state.openUpload}
                    onClose={() => this.setState({ openUpload: false })}
                >
                    <DialogTitle>{"Upload a new profile picture"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You can upload any picture as your new profile picture! Format should be 1:1.
                        </DialogContentText>
                        <form id="myform">
                            <input type="file" id="profilePic" name="profilePic" accept="image/*"/>
                        </form>
                        </DialogContent>
                    <DialogActions>
                    <Button onClick={() => this.setState({ openUpload: false })} color="primary">
                        Disagree
                    </Button>
                    <Button color="primary" autoFocus onClick={() => this.uploadImage()}>
                        Agree
                    </Button>
                    </DialogActions>
                </Dialog>
                <SnackbarMessage
                    open={this.state.open}
                    onClose={() => this.setState({ open: false })}
                    message={this.state.message}
                    color={this.state.snackcolor}>
                </SnackbarMessage>
            </div>
        );
    }
}

/**
 * Defines the LoginUserForm Component.
 * Displays Login Fields.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - LoginUserForm Component
 */
export default withStyles(useStyles) (ProfilePicture);