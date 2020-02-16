import React, { Component } from "react";
import { Post, SocketContext } from "../exports";
import { Typography } from '@material-ui/core';

class ProfileFeed extends Component {
<<<<<<< HEAD:client/src/components/feed/profile_feed.js
    constructor() {
        super();
        this.state = {
            response: [],
            newpost: "",
            error: null,
        };
        this.socket = SocketContext;
        this.onLike = this.onLike.bind(this);
    }
=======
  constructor() {
    super();
    this.state = {
      response: [],
      newpost: "",
      error: null,
    };
    this.socket = SocketContext;
    this.onLike = this.onLike.bind(this);
  }
>>>>>>> parent of 860dff1... Likes + Personal follower feed included:client/src/components/user/profile_feed.js

    onLike(id) {
        console.log("test");
    }

<<<<<<< HEAD:client/src/components/feed/profile_feed.js
    componentDidMount() {
=======
  componentDidMount() {
    
    var userid = this.props.id;
>>>>>>> parent of 860dff1... Likes + Personal follower feed included:client/src/components/user/profile_feed.js

        var userid = this.props.id;

        this.socket.emit("join", userid)


<<<<<<< HEAD:client/src/components/feed/profile_feed.js
        this.socket.on('post', (rawPost => {
            var previous = this.state.response;
            var newpost = JSON.parse(rawPost);
            previous.unshift(newpost)
            this.setState({ response: previous });
        }));

        this.socket.on('error', (err) => {
            this.setState({ error: "-- " + err + " --" });
        });
    }
=======
    this.socket.on('error', (err) => {
      this.setState({ error: "-- "+err+" --" });
    });
  }
>>>>>>> parent of 860dff1... Likes + Personal follower feed included:client/src/components/user/profile_feed.js

    componentWillUnmount() {
        var userid = this.props.id;
        this.socket.emit("leave", userid)
    }

<<<<<<< HEAD:client/src/components/feed/profile_feed.js
    render() {
        const { response, error } = this.state;
        let showposts = null;

        if (response.length === 0 || response == null || typeof response != "object") {
            showposts = (
                <div>
                    <Typography variant="h4">No Posts :/</Typography>
                    <Typography variant="subtitle1">This user has not posted yes!</Typography>
                    <Typography variant="h6">{error}</Typography>
                </div>
            )
        } else {
            showposts = (
                <div>
                    {response.map((data, i) => (
                        <Post
                            key={i}
                            post={data}
                            onLike={this.onLike}>
                        </Post>
                    ))}
                </div>)
        }
        return showposts;
=======
  render() {
    const { response, error } = this.state;
    let showposts = null;
    
    if(response.length === 0 || response == null || typeof response != "object" ){
      showposts = (
        <div>
          <Typography variant="h4">No Posts :/</Typography>
          <Typography variant="subtitle1">This user has not posted yes!</Typography>
          <Typography variant="h6">{error}</Typography>
        </div>
      )
    } else {

      showposts = (
        <div>
          {response.map((data, i)=> (
            <Post 
              key={i}
              post={data}
              onLike={this.onLike}>
            </Post>         
        ))}
      </div>)
>>>>>>> parent of 860dff1... Likes + Personal follower feed included:client/src/components/user/profile_feed.js
    }
}

export default ProfileFeed;