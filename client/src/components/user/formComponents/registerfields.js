import React, { Component } from 'react';
import { withStyles, TextField } from '@material-ui/core';
import useStyles from "../../other/useStyles";

/** RegisterFields Component */
class RegisterFields extends Component {
    constructor(props){
        super(props);   
        this.handleChange = this.handleChange.bind(this)     
    }

    /** Change values (onKeyboardInput) of controlled TextField components */
    handleChange(e, name, value) {
        this.props.onChange(e, name, value);
    }

    render(){
        const { disablefields, username, password, confirmpassword} = this.props;

        return (
            <div>
                <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Benutzername"
                        name="username"
                        value={username}
                        onChange={this.handleChange}
                        disabled={disablefields}
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Passwort"
                        type="password"
                        value={password}
                        onChange={this.handleChange}
                        disabled={disablefields}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="confirmpassword"
                        label="Bestätige Passwort"
                        type="password"
                        value={confirmpassword}
                        onChange={this.handleChange}
                        disabled={disablefields}
                    />
            </div>
        )
    }
}

/**
 * Defines the RegisterFields Component.
 * Shows all Fields needed for user registration.
 * @param {props} props - Given properties of mother component (styling, TextField props,...)
 * @return {Component} - RegisterFields Component
 */
export default withStyles(useStyles) (RegisterFields);
