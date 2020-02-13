import React, { Component } from 'react';
import { Avatar, CssBaseline, Typography, Container, withStyles } from '@material-ui/core';
import { PersonOutlined as PersonAddOutlinedIcon } from '@material-ui/icons';
import { useStyles, RegisterUserForm } from '../components/exports'

/** Register Component */
class Register extends Component {
    render() {       
        const { classes } = this.props;

        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                    <PersonAddOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Registrierung
                    </Typography>
                    <RegisterUserForm></RegisterUserForm>
                </div>
            </Container>
        );
    }
}

/**
 * Defines the Register Component.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - Register Component
 */
export default withStyles(useStyles) (Register);