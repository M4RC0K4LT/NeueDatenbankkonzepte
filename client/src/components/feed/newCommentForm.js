import React, { Component } from "react";
import { SocketContext, useStyles } from '../exports';
import { TextField, Button, withStyles, InputAdornment} from '@material-ui/core';
import { Image as ImageIcon } from '@material-ui/icons';
import PostPicture from './postPicture'

/** NewCommentForm Component to provide a TextField for creating a new post */
class NewCommentForm extends Component {

    //Initialize state values and socket
    constructor() {
        super();
        this.state = {
            newpost: "",
            error: false,
            uploadFoto: false,
            filename: "",
            picture_included: false,
            deleted: false,
        };
        this.socket = SocketContext;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    //Handle input changes
    handleChange(event) {
        this.setState({ newpost: event.target.value });
    }

    //Handle post submit
    handleSubmit(event) {
        event.preventDefault();
        if (this.state.newpost.length === 0) {
            this.setState({ error: true });
            return;
        }
        this.socket.emit('new globalpost', JSON.stringify({ content: this.state.newpost, picture: this.state.filename }));
        this.setState({ error: false, newpost: "", filename: "", picture_included: false });
    }

    render() {
        return (
            <form>
                <PostPicture
                    open={this.state.uploadFoto}
                    onClose={() => this.setState({ uploadFoto: false })}
                    uploaded={(filename) => this.setState({ filename: filename, picture_included: true })}
                    deleted={this.state.deleted}
                    ></PostPicture>
                <TextField
                    id="outlined-multiline-static"
                    multiline
                    error={this.state.error}
                    rows="4"
                    variant="outlined"
                    placeholder="Write down your thoughts..."
                    value={this.state.newpost}
                    fullWidth
                    onChange={this.handleChange}
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment style={{ cursor: "pointer" }} position="end" onClick={() => this.state.picture_included ? this.setState({ filename: "", deleted: true, picture_included: false }) : this.setState({ uploadFoto: true })}>
                                <ImageIcon color={this.state.picture_included ? "secondary" : "inherit"}/>
                            </InputAdornment>
                        ),
                    }}>
                </TextField>

                <Button variant="contained" className={this.props.classes.submitTweet} color="primary" onClick={this.handleSubmit}>Submit</Button>
            </form>

        );
    }
}

/**
 * Defines the NewCommentForm Component.
 * Displays a textfield to write and submit a new post.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - NewCommentForm Component
 */
export default withStyles(useStyles) (NewCommentForm);