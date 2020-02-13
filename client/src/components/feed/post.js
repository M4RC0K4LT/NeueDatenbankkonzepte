import React, { Component } from "react";
import { Card, CardContent, CardActions, IconButton, Typography } from '@material-ui/core';
import { Favorite as FavoriteIcon } from '@material-ui/icons';

class Post extends Component {
  constructor(props){
    super(props);    
    this.handleLike = this.handleLike.bind(this);  
}

  handleLike(id){
    this.props.onLike(id);
  }

  render() {
    const { post } = this.props
    let test = post.content.split("\n");
    return (
        <Card variant="outlined" style={{ marginBottom: ".5rem" }}>
            <CardContent>
                {test.map((data, i) => {
                  if(data.length == 0){
                    if(!(i == test.length-1) && (test[i+1].length == 0)){
                      return
                    }
                  }
                  if(i < test.length-1){
                    return (
                      <Typography key={i} variant="body1">
                        {data}
                        <br />
                      </Typography>
                    )
                  }else {
                    return (
                      <Typography key={i} variant="body1">
                        {data}
                      </Typography>
                    )
                  }

                })}
            </CardContent>
            <CardActions>
              <IconButton style={{ marginLeft: "auto" }} onClick={this.handleLike(post.id)}>
                <FavoriteIcon />
              </IconButton>
            </CardActions>
        </Card> 
    );
  }
}

export default Post;