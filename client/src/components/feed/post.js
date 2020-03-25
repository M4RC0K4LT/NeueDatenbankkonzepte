import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Card, CardContent, CardActions, IconButton, Typography, Box, withStyles, CardMedia, Divider, Avatar } from '@material-ui/core';
import { Favorite as FavoriteIcon } from '@material-ui/icons';
import { SocketContext, useStyles } from "../exports";
import Linkify from 'linkifyjs/react';
import * as linkify from 'linkifyjs';
import hashtag from 'linkifyjs/plugins/hashtag';

//Set options for npm-linkify to style hashtags
var linkifyOptions = {
    format: function (value, type) {
        value = <Link to={"/hashtags/" + value.substring(1)} style={{ textDecoration: "none", color: "#64b5f6" }}>{value}</Link>
        return value;
    },
    tagName: 'span',
}
hashtag(linkify);

/** Post Component to display a all post related content */
class Post extends Component {

    //Initialize socket
    constructor(props) {
        super(props);
        this.handleLike = this.handleLike.bind(this);
        this.socket = SocketContext;
    }

    //Use handle like function of parent component
    handleLike(){
        this.props.handleLike();
    }

    render() {
        const { username, userid, content, timestamp, likes, liked, picture } = this.props

        let image = null;
        if(picture.length !== 0){
            image = (
                <div>
                    <CardMedia
                        style={{paddingTop: '56.25%', margin: "0px", borderRadius: "0px"}}
                        image={"http://localhost:3000/postPics/" + picture}
                    />
                    <Divider></Divider>
                </div>
            )
        }
        var postdate = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(timestamp);
        let lines = content.split("\n");

        return (
            <Card variant="outlined" style={{ marginBottom: "1.7rem" }}>

                {/** Display main post content */}
                {image}
                <CardContent>
                    {lines.map((data, i) => {
                        if (data.length === 0) {
                            if (!(i === lines.length - 1) && (lines[i + 1].length === 0)) {
                                return null;
                            }
                        }
                        if (i < lines.length - 1) {
                            return (
                                <Linkify key={i} options={linkifyOptions} style={{ textDecoration: "none" }}>
                                    <Typography variant="body">
                                        {data}
                                        <br />
                                    </Typography>
                                </Linkify>
                            )
                        } else {
                            return (
                                <Linkify key={i} options={linkifyOptions} style={{ textDecoration: "none" }}>
                                    <Typography variant="body1">
                                        {data}
                                    </Typography>
                                </Linkify>
                            )
                        }
                    })}
                </CardContent>

                {/** Display post creator, details and actions */}
                <CardActions>
                    <Typography variant="body2">{postdate}&nbsp; &nbsp; &nbsp; by&nbsp;&nbsp;&nbsp; &nbsp; &nbsp;</Typography>
                    <Avatar style={{ height: "25px", width: "25px" }} src={window.$apiroute + "/profilePics/user_" + userid + ".png"} />
                    <Link to={"/profile/"+userid} style={{ textDecoration: "none", color: "inherit", display: "inline-block" }}>
                        <Typography variant="button">
                            <Box fontWeight="fontWeightBold" fontStyle="italic">{username}</Box>
                        </Typography>
                    </Link>
                    <IconButton style={{ marginLeft: "auto" }}>
                        {likes}
                    </IconButton>
                    <IconButton onClick={() => this.handleLike()}>
                        <FavoriteIcon style={liked ? {color: "red"} : {color: "inherit"} }/>
                    </IconButton>
                </CardActions>
            </Card>
            
        );
    }
}

/**
 * Defines the Post Component.
 * Displays a post.
 * @param {props} props - Given properties of mother component (styling,...).
 * @return {Component} - Post Component
 */
export default withStyles(useStyles) (Post);