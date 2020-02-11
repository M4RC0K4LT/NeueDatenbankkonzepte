import React, { Component } from "react";
import { Card, CardContent } from '@material-ui/core';

class Post extends Component {

  render() {
    const { post } = this.props;

    return (
        <Card variant="outlined" style={{ marginBottom: ".5rem" }}>
            <CardContent>
                {post.content}
            </CardContent>
        </Card> 
    );
  }
}

export default Post;