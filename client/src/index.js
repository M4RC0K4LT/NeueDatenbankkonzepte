import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom'
import GlobalFeed from "./main/GlobalFeed"
import { ResponsiveDrawer, PrivateRoute, ShowFollowedUsers } from './components/exports'
import { Grid } from '@material-ui/core';
import Login from './main/login';
import Register from './main/register';
import Profile from './main/profile';
import PersonalFeed from './main/PersonalFeed';

window.$apiroute = "http://localhost:3000";

class Index extends React.Component{

  render(){
    
    let sidebars = null;
    if(!(window.location.pathname == "/login" || window.location.pathname == "register")){
        sidebars = (
            <Grid item xs={0} zeroMinWidth={true} md={2}>
                <ShowFollowedUsers></ShowFollowedUsers>
            </Grid>  
        )
    }
      
    let content = (
        <Grid
            style={{ marginTop: "5rem", height: "100%" }}
            container
            direction="row"
            justify="center"
            spacing={2}
        >
            <Grid item xs={11} md={6}>  
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <PrivateRoute exact path="/" component={GlobalFeed} />
                    <PrivateRoute exact path="/feed" component={GlobalFeed} />
                    <PrivateRoute path="/profile/:id" component={Profile} />
                    <PrivateRoute exact path="/profile" component={Profile} />
                    <PrivateRoute exact path="/personal" component={PersonalFeed} />
                </Switch>
            </Grid>
            {sidebars}
        </Grid>
    )

    return (
        <Router>
            <ResponsiveDrawer
                content={content}>
            </ResponsiveDrawer>           
        </Router>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'))