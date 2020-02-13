import React, { Component } from "react";
import { Card, CardContent } from '@material-ui/core';

class Post extends Component {

  render() {
    const { post } = this.props;

    return (
        <Card variant="outlined" style={{ marginBottom: ".5rem" }}>
            <CardContent>
                User: {post.user}<br></br>
                Content: {post.content}<br></br> 
                Datum: {post.posted}<br></br>
                Likes: {post.likes}
            </CardContent>
        </Card> 
    );
  }
}

export default Post;