import React, { Component } from 'react';
import { Button, withStyles} from '@material-ui/core';
import { useStyles, RegisterFields } from '../exports'
import { postNewUser } from "../../api/exports";
import { Redirect } from 'react-router-dom';

/** RegisterUserForm Component to provide a form for registering new users */
class RegisterUserForm extends Component {

    //Initializes TextField values and error handling
    constructor(props){
        super(props);
        this.state = {
            response: [],
            isLoading: false,
            error: null,
            message: "",
            open: false,
            snackcolor: "error",
            disablefields: false,
            success: false,

            username: "",
            password: "",
            confirmpassword: ""

        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }    

    //EventHandler: changing Value of controlled TextField
    handleInputChange(event) {
        const target = event.target;
        const value = target.value
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }

    //Close Error/Success Message
    handleSnackbarClose(){
        this.setState({ open: false })
    }
    
    //Submit data
    handleSubmit(event){ 
        event.preventDefault();
        const { username, mail, password, confirmpassword} = this.state;
        
        if(password !== confirmpassword){
            this.setState({ message: "Passwörter stimmen nicht überein", open: true, snackcolor: "error" })
            return;
        }
        this.setState({ disablefields: true });
        postNewUser(username, password).then(data => {
            if(data.length<1 || data.request === "failed"){
                alert(data.error)
                this.setState({ open: true, snackcolor: "error", message: data.error, disablefields: false })
            } else {
                alert("subba")
                sessionStorage.setItem('authToken', data.token);
                this.setState({ success: true })
            }
        })
    }

    render() {
        
        const { classes } = this.props;
        const { username, password, confirmpassword, disablefields, success } = this.state;

        //Check if already logged in
        if (sessionStorage.getItem("authToken") != null){
            return <Redirect to={"/feed"} />;
        }

        //Successful registration
        if(success === true){
            return window.location.replace("/feed");
        }

        return (
            <div>
                <form className={classes.form} onSubmit={this.handleSubmit}>
                <RegisterFields
                    disablefields={disablefields}
                    username={username}
                    password={password}
                    confirmpassword={confirmpassword}
                    onChange={this.handleInputChange}>
                </RegisterFields>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                >
                    Registrieren
                </Button>
                </form>
            </div>
        );
    }
}

/**
 * Defines the RegisterUserForm Component.
 * Displays form for the registration of a new user.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - RegisterUserForm Component
 */
export default withStyles(useStyles) (RegisterUserForm);