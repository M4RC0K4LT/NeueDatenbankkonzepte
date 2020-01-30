import React, { Component } from "react";
import Feed from "./components/feed/feed"
import NewCommentForm from "./components/feed/newCommentForm"

class GlobalFeed extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>    
        <NewCommentForm></NewCommentForm>
        <hr></hr>
        <Feed></Feed>
      </div>
    );
  }
}

export default GlobalFeed;