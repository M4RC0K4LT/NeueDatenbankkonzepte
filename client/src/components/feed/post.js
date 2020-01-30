import React, { Component } from "react";

class Post extends Component {
  constructor() {
    super();
  }

  render() {
    const { post } = this.props;

    return (
        <div class="card post" style={{ marginBottom: ".5rem" }}>
            <div class="card-body">
                {post.content}
            </div>
        </div> 
    );
  }
}

export default Post;