import React, { Component } from "react";
import { Card, CardContent, CardActions, IconButton, Typography, Box, withStyles, CardMedia } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Favorite as FavoriteIcon } from '@material-ui/icons';
import { SocketContext, useStyles } from "../exports";
import Linkify from 'linkifyjs/react';
import * as linkify from 'linkifyjs';
import hashtag from 'linkifyjs/plugins/hashtag';

var linkifyOptions = {
    format: function (value, type) {
        value = <Link to={"/hashtags/" + value.substring(1)} style={{ textDecoration: "none", color: "#64b5f6" }}>{value}</Link>
        return value;
    },
}

hashtag(linkify);

class Post extends Component {
    constructor(props) {
        super(props);
        this.handleLike = this.handleLike.bind(this);
        this.socket = SocketContext;
    }

    handleLike(){
        this.props.handleLike();
    }

    render() {
        const { username, userid, content, timestamp, likes, liked, picture } = this.props

        let image = null;
        if(picture.length != 0){
            image = (
                <CardMedia
                    style={{paddingTop: '56.25%', margin: "25px", borderRadius: "10px"}}
                    image={"http://localhost:3000/postPics/" + picture}
                />
            )
        }
        var postdate = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(timestamp);
        let test = content.split("\n");
        return (
            <Card variant="outlined" style={{ marginBottom: ".5rem" }}>
                {image}
                <CardContent>
                    {test.map((data, i) => {
                        if (data.length == 0) {
                            if (!(i == test.length - 1) && (test[i + 1].length == 0)) {
                                return
                            }
                        }
                        if (i < test.length - 1) {
                            return (
                                <Linkify options={linkifyOptions} style={{ textDecoration: "none" }}>
                                    <Typography key={i} variant="body">
                                        {data}
                                        <br />
                                    </Typography>
                                </Linkify>
                            )
                        } else {
                            return (
                                <Linkify options={linkifyOptions} style={{ textDecoration: "none" }}>
                                    <Typography key={i} variant="body">
                                        {data}
                                    </Typography>
                                </Linkify>
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

export default withStyles(useStyles) (Post);