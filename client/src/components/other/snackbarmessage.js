import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Snackbar, SnackbarContent } from '@material-ui/core';
import Slide from '@material-ui/core/Slide';
import useStyles from "./useStyles";

/** Defines Opening/Closing Transition of snackbar */
function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

/** Creates SnackbarMessage -> used for sending error or success messages */
class SnackbarMessage extends Component {
    constructor(props){
        super(props);   
        this.handleClose = this.handleClose.bind(this)     
    }

    //Use Props-Method for closing snackbar (opened by a prop, so has to be closed by it again)
    handleClose(e) {
        this.props.onClose();
    }

    render(){
        var { classes, open, message, color } = this.props

        //Use correct color on error/success
        if(color === "success"){
            color = classes.success
        } else{
            color = classes.error
        }

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                open={open}
                autoHideDuration={4000}
                onClose={() => this.handleClose()}
                TransitionComponent={SlideTransition}>
                <SnackbarContent 
                    className={color}
                    message={<center>{message}</center>}
                    >
                </SnackbarContent>
            </Snackbar>
        )
    }
}

/**
 * Protected Routes (Client Side).
 * @param {props} props - Properties given from mother element: open, onClose, message, color
 * @return {Snackbar} Show suitable snackbar.
 */
export default withStyles(useStyles) (SnackbarMessage);
