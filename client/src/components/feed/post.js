import React, { Component } from "react";
import { Card, CardContent, CardActions, IconButton, Typography, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Favorite as FavoriteIcon } from '@material-ui/icons';
import { SocketContext } from "../exports";

class Post extends Component {
    constructor(props) {
        super(props);
        this.handleLike = this.handleLike.bind(this);
        this.socket = SocketContext;
        //this.state = {multerImage: DefaultImg}
    }

    handleLike(){
        this.props.handleLike();
    }

    /*setDefaultImage(uploadType) {
        if (uploadType === "multer") {
            this.setState({
                multerImage: DefaultImg
            });
        }
    }

    uploadImage(e, method) {
        let imageObj = {};

        if (method === "multer") {
            let imageFormObj = new FormData();

            imageFormObj.append("imageName", "multer-image" + Date.now());
            imageFormObj.append("imageData", e.target.files[0]);

            this.setState({
                multerImage: URL.createObjectURL(e.target.files[0])
            });

            Router.post(`${API_URL}/image/uploadmulter`, imageFormObj)
                .then((data) => {
                    if (data.data.success) {
                        alert("Image successfully uploaded");
                        this.setDefaultImage("multer");
                    }
                })
                .catch((err) => {
                    alert("Error");
                    this.setDefaultImage("multer");
                });
        }
    }*/


    render() {
        const { username, userid, postid, content, timestamp, likes, liked } = this.props

        var postdate = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(timestamp);
        let test = content.split("\n");
        return (
            <Card variant="outlined" style={{ marginBottom: ".5rem" }}>
                <CardContent>
                    {test.map((data, i) => {
                        if (data.length == 0) {
                            if (!(i == test.length - 1) && (test[i + 1].length == 0)) {
                                return
                            }
                        }
                        if (i < test.length - 1) {
                            return (
                                <Typography key={i} variant="body">
                                    {data}
                                    <br />
                                </Typography>
                            )
                        } else {
                            return (
                                <Typography key={i} variant="body">
                                    {data}
                                </Typography>
                            )
                        }
                    })}
                </CardContent>
                <CardActions>
                    {postdate}&nbsp; by&nbsp;&nbsp; <Link to={"/profile/"+userid} style={{ textDecoration: "none", color: "inherit" }}><Typography variant="button"><Box fontWeight="fontWeightBold" fontStyle="italic">{username}</Box></Typography></Link>
                    <IconButton style={{ marginLeft: "auto" }}>
                        {likes}
                    </IconButton>
                    <IconButton onClick={() => this.handleLike()}>
                        <FavoriteIcon style={liked ? {color: "red"} : {color: "inherit"} }/>
                    </IconButton>
                </CardActions>

                {/* Express serve static files */}
                {/*<div>
                    <p>Upload Image</p>
                    <input type="file" onChange={(e) => this.uploadImage(e,"multer")}/>
                    <img src={this.state.multerImage} />
                </div>*/}
            </Card>
            
        );
    }
}

export default Post;