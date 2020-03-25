import React, { Component } from 'react';

import { Button, withStyles, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import { useStyles, SnackbarMessage } from '../exports'
import { postPostPicture } from '../../api/exports'

/** PostPicture Component provides upload dialog and handles picture/image upload for an upcoming post */
class PostPicture extends Component {

    //Initializes state values and error handling
    constructor(props){
        super(props);
        this.state = {
            openUpload: false,
            message: "",
            snackcolor: "error",
        };
        this.uploadImage = this.uploadImage.bind(this);
        
    }   

    //Handles image/picture upload
    uploadImage () {
        var form = document.getElementById("myform");
        var formData = new FormData(form);
        postPostPicture(formData).then(data => {
            if(data.length<1 || data.request === "failed"){
                this.setState({ snackcolor: "error", message: data.error, open: true })
            }else {
                this.setState({ snackcolor: "success", message: "Picture successfully added to your upcoming post!", open: true })
                this.props.uploaded(data.uuid)
                this.props.onClose();
            }
        })
    }

    //On page updates
    componentDidUpdate(prevProps){
        if(this.props.deleted !== prevProps.deleted){
            if(this.props.deleted){
                this.setState({ snackcolor: "error", message: "Picture deleted", open: true })
            }
        }
    }

    render() {      
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onClose={this.props.onClose}
                >
                    <DialogTitle>{"Upload a picture to your post"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            You can upload any picture to support your post. 16:9
                        </DialogContentText>
                        <form id="myform">
                            <input type="file" id="postPic" name="postPic" accept="image/*"/>
                        </form>
                        </DialogContent>
                    <DialogActions>
                    <Button onClick={this.props.onClose} color="secondary">
                        Abbrechen
                    </Button>
                    <Button color="secondary" autoFocus onClick={() => this.uploadImage()}>
                        Hinzufügen
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
 * Defines the PostPicture Component.
 * Displays dialog for uploading and handles picture/image upload regarding a new post
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - PostPicture Component
 */
export default withStyles(useStyles) (PostPicture);