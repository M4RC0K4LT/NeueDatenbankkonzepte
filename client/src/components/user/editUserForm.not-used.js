import React, { Component } from 'react';
import { withStyles, CircularProgress} from '@material-ui/core';
import { SnackbarMessage, useStyles, UserFields} from '../exports'
import { getUser, putUser } from "../../api/exports";

/** EditUserForm Component to display current user data and to edit it */
class EditUserForm extends Component {

    //Initializes TextField values and error handling
    constructor(props){
        super(props);
        this.state = {
            userdata: [],
            isLoading: false,
            error: null,
            message: "",
            open: false,
            snackcolor: "error",

            userid: "",
            username: "",
            mail: "",
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
        const value = target.value;
        const name = target.name;    
        this.setState({ [name]: value });
    }
    
    //Close Error/Success Message
    handleSnackbarClose(){
        this.setState({ open: false })
    }
    
    //Submit FormData (Updated Values)
    handleSubmit(event){ 
        event.preventDefault();
        const { username, mail, password, confirmpassword} = this.state;

        if(password !== confirmpassword){
            this.setState({ message: "Passwörter stimmen nicht überein", open: true, isLoading: false, snackcolor: "error" })
            return;
        }
        this.setState({ isLoading: true, disablefields: true });
        putUser(username, mail, password).then(data => {
            this.setState({ isLoading: false });
            if(data.length<1 || data.request === "failed"){
                this.setState({ open: true, snackcolor: "error", message: data.error, disablefields: false, password: "", confirmpassword: "" })
            } else {
                this.setState({ name: data.user_name, mail: data.user_mail, snackcolor: "success", open: true, message: "User erfolgreich akutalisiert", disablefields: false});
            }
        })
    }

    //Get current Userdata
    fetchUser() {
        this.setState({ isLoading: true });
        getUser().then(data => {
            this.setState({ isLoading: false });
            if(data.length<1 || data.request === "failed"){
                this.setState({ open: true, snackcolor: "error", message: data.error })
            }else {
                this.setState({ 
                    userid: data.user_id,
                    username: data.user_name,
                    mail: data.user_mail,
                 })
            }
        })
    }

    componentDidMount() {
        this.fetchUser();
    }

    render() {
        
        const { classes } = this.props;
        const { isLoading, userid, username, mail, password, confirmpassword, disablefields } = this.state;

        //LoadingIcon
        let loading = null;
        if(isLoading && disablefields){
            loading = <CircularProgress className={classes.loading} size={100}></CircularProgress>
        }

        return (
            <div>
                <SnackbarMessage
                    open={this.state.open}
                    onClose={this.handleSnackbarClose}
                    message={this.state.message}
                    color={this.state.snackcolor}>
                </SnackbarMessage>
                {loading}
                <form className={classes.form} onSubmit={this.handleSubmit}>
                <UserFields
                    disablefields={disablefields}
                    userid={userid}
                    username={username}
                    mail={mail}
                    password={password}
                    confirmpassword={confirmpassword}
                    onChange={this.handleInputChange}>
                </UserFields>
                </form>
            </div>
        );
    }
}

/**
 * Defines the EditUserForm Component.
 * Displays form for editing user information
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - EditUserForm Component
 */
export default withStyles(useStyles) (EditUserForm);