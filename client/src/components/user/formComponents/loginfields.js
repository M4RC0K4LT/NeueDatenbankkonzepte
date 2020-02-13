import React, { Component } from 'react';
import { withStyles, TextField } from '@material-ui/core';
import useStyles from "../../other/useStyles";

/** LoginFields Component */
class LoginFields extends Component {
    constructor(props){
        super(props);   
        this.handleChange = this.handleChange.bind(this)     
    }

    /** Change values (onKeyboardInput) of controlled TextField components */
    handleChange(e, name, value) {
        this.props.onChange(e, name, value);
    }

    render(){
        const { disablefields, username, password} = this.props;

        return (
            <div>
                <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
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
                        label="Passwort"
                        type="password"
                        name="password"
                        value={password}
                        disabled={disablefields}
                        onChange={this.handleChange}
                    />
            </div>
        )
    }
}

/**
 * Defines the LoginFields Component.
 * Shows all Fields needed for UserLogin
 * @param {props} props - Given properties of mother component (styling, TextField props,...)
 * @return {Component} - LoginFields Component
 */
export default withStyles(useStyles) (LoginFields);
