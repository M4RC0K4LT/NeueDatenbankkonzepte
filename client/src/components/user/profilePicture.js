import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Avatar, Button, withStyles, Input, Dialog, DialogActions, DialogTitle, DialogContent, DialogContentText } from '@material-ui/core';
import { useStyles } from '../exports'

/** LoginUserForm Component displays form to log in existing user */
class ProfilePicture extends Component {

    //Initializes TextField values and error handling
    constructor(props){
        super(props);
        this.state = {
            open: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }   

    
    //Submit provided login data
    handleSubmit(event){ 
        event.preventDefault();
    };

    render() {
        
        const { classes } = this.props;

        return (
            <div>
                <Avatar onClick={() => this.setState({ open: true })} className={classes.ProfileAvatar} src="https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg"></Avatar>
                <Dialog
                    open={this.state.open}
                    onClose={() => this.setState({ open: false })}
                >
                    <DialogTitle>{"Upload a new profile picture"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You can upload any picture as your new profile picture! Format should be 1:1.
                        </DialogContentText>
                        <form method="post" action="http://localhost:3000/profilePicForm" encType="multipart/form-data" id="my-form">
                            <input type="file"id="postPic" name="postPic" accept="image/*"/>
                        </form>
                        </DialogContent>
                    <DialogActions>
                    <Button color="primary">
                        Disagree
                    </Button>
                    <Button color="primary" autoFocus form='my-form' type="submit">
                        Agree
                    </Button>
                    </DialogActions>
                </Dialog>
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