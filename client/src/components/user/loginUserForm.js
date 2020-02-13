import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, withStyles} from '@material-ui/core';
import { useStyles, LoginFields} from '../exports'
import { postUser } from "../../api/exports";

/** LoginUserForm Component displays form to log in existing user */
class LoginUserForm extends Component {

    //Initializes TextField values and error handling
    constructor(props){
        super(props);
        this.state = {
            disablefields: false,
            message: "",
            open: false,
            snackcolor: "error",
            success: false,
            username: "",
            password: "",
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);     
    }   
    
    //EventHandler: changing Value of controlled TextField
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }
    
    //Close Error/Success Message
    handleSnackbarClose(){
        this.setState({ open: false })
    }
    
    //Submit provided login data
    handleSubmit(event){ 
        event.preventDefault();
        this.setState({ disablefields: true });
        const { username, password, } = this.state;
        postUser(username, password).then(data => {
            if(data.length<1 || data.request === "failed"){
                this.setState({ open: true, snackcolor: "error", message: data.error, disablefields: false })
            }else {
                sessionStorage.setItem('authToken', data.token);
                this.setState({ success: true })
            }
        })
    };

    render() {
        
        const { classes } = this.props;
        const { success, disablefields, username, password } = this.state;
        
        //Successful Login
        if(success){
            return window.location.replace("/feed");
        }

        //Already logged in?
        if (sessionStorage.getItem("authToken") != null){
            return window.location.replace("/feed");
        }

        return (
            <div>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                <LoginFields
                    username={username}
                    password={password}
                    disablefields={disablefields}
                    onChange={this.handleInputChange}
                    >
                </LoginFields>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Login
                </Button>
                <Button
                    component={Link}
                    to="/register"
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Registrieren
                </Button>
                </form>
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
export default withStyles(useStyles) (LoginUserForm);