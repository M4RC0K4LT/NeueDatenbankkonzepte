import React, { Component } from 'react';
import { Avatar, CssBaseline, Typography, Container, withStyles} from '@material-ui/core';
import { LockOutlined as LockOutlinedIcon} from '@material-ui/icons';
import { useStyles, LoginUserForm } from '../components/exports'

/** Login Component */
class Login extends Component {
    render() {    
        const { classes } = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Anmelden
                    </Typography>
                    <LoginUserForm></LoginUserForm>
                </div>
            </Container>
        );
    }
}

/**
 * Defines the Login Component.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - Login Component
 */
export default withStyles(useStyles) (Login);