import React, { Component } from "react";
import { PersonalFeedPosts, NewCommentForm } from '../components/exports';
import { Box, Typography } from '@material-ui/core';

class GlobalFeed extends Component {

    render() {
        return (
            <div>
                <Typography variant="h3" align="center">Personal Feed</Typography>
                <br></br>
                <Typography variant="h4" align="center">The place for your friends posts</Typography>
                <br></br><br></br><hr></hr><br></br><br></br>
                <PersonalFeedPosts></PersonalFeedPosts>



                <br></br><br></br><br></br>
                <img src="http://localhost:3000/postPics/RS4.jpg"></img>
                <br></br><br></br>
                <p>Bilder für Posts</p>
                <form  method="post" action="http://localhost:3000/postPicForm" encType="multipart/form-data">
                    <input type="file" id="postPic" name="postPic" accept="image/*"></input>
                    <button>Upload</button>
                </form>

                <p>Profilbilder</p>
                <form  method="post" action="http://localhost:3000/profilePicForm" encType="multipart/form-data">
                    <input type="file" id="profilePic" name="profilePic" accept="image/*"></input>
                    <button>Upload</button>
                </form>


            </div>
        );
    }
}

export default GlobalFeed;