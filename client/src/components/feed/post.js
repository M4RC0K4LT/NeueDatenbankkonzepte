import React, { Component } from "react";
import { Card, CardContent, CardActions, IconButton, Typography, Box } from '@material-ui/core';
import { Link } from 'react-router-dom'
import { Favorite as FavoriteIcon } from '@material-ui/icons';

class Post extends Component {
    constructor(props) {
        super(props);
        this.handleLike = this.handleLike.bind(this);
    }

    handleLike(id) {
        this.props.onLike(id);
    }

    render() {
        const { post } = this.props

        console.log(post)
        var postdate = new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format(post.timestamp);
        let test = post.content.split("\n");
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
                                <Typography key={i} variant="h6">
                                    {data}
                                    <br />
                                </Typography>
                            )
                        } else {
                            return (
                                <Typography key={i} variant="h6">
                                    {data}
                                </Typography>
                            )
                        }
                    })}
                </CardContent>
                <CardActions>
                    {/*User: {post.user}<br></br>*/}
                    {postdate}&nbsp; by&nbsp;&nbsp; <Link to={"/profile/"+post.userid} style={{ textDecoration: "none", color: "inherit" }}><Typography variant="button"><Box fontWeight="fontWeightBold" fontStyle="italic">{post.username}</Box></Typography></Link>
                    <IconButton style={{ marginLeft: "auto" }} onClick={this.handleLike(post.id)}>
                        <FavoriteIcon />
                    </IconButton>
                </CardActions>
            </Card>
        );
    }
}

export default Post;