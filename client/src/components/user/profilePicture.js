import React, { Component } from 'react';
import { Avatar, Button, withStyles, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import { useStyles, SnackbarMessage } from '../exports'
import { postProfilePicture, deleteProfilePicture } from '../../api/exports'
import SettingsIcon from '@material-ui/icons/Settings';
import DeleteIcon from '@material-ui/icons/Delete';

/** ProfilePicture Component to handle all actions regarding a profile picture and displaying it */
class ProfilePicture extends Component {

    //Initializes state values
    constructor(props){
        super(props);
        this.state = {
            open: false,
            openUpload: false,
            openDelete: false,
            message: "",
            snackcolor: "error",
            imageHash: Date.now()
        };

        this.uploadImage = this.uploadImage.bind(this);
    };

    //Upload a new picture/image
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

    //Remove existing profile picture/image
    removeImage () {
        deleteProfilePicture();
        this.setState({ snackcolor: "success", message: "Successfully removed profile picture!", open: true, openDelete: false })
    }

    render() {
        
        const { classes, userid, own } = this.props;
        let settings, del = null;
        if(own){
            settings = <SettingsIcon style={{ position: "absolute", top: 0, right: 30 }} onClick={() => this.setState({ openUpload: true })}></SettingsIcon>
            del = <DeleteIcon style={{ position: "absolute", top: 0, right: 0 }} onClick={() => this.setState({ openDelete: true })}></DeleteIcon>
        }

        return (
            <div style={{ position: "relative" }}>
                {settings}
                <Avatar className={classes.ProfileAvatar} src={`${window.$apiroute + "/profilePics/user_" + userid + ".png?"}?${new Date().getTime()}`}></Avatar>
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
                    <Button onClick={() => this.setState({ openUpload: false })} color="secondary">
                        Disagree
                    </Button>
                    <Button color="secondary" autoFocus onClick={() => this.uploadImage()}>
                        Agree
                    </Button>
                    </DialogActions>
                </Dialog>

                {del}
                <Dialog
                    open={this.state.openDelete}
                    onClose={() => this.setState({ openUpload: false })}
                >
                    <DialogTitle>{"Do you really want to remove your profile picture?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            This will delete your profile picture.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => this.setState({ openDelete: false })} color="secondary">
                            Disagree
                        </Button>
                        <Button color="secondary" autoFocus onClick={() => this.removeImage()}>
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
 * Defines the ProfilePicture Component.
 * Displays ProfilePicture and handles its changes.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - ProfilePicture Component
 */
export default withStyles(useStyles) (ProfilePicture);