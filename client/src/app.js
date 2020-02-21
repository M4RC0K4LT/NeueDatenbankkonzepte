import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom'
import ReactDOM from 'react-dom'
import GlobalFeed from "./main/GlobalFeed"
import { ResponsiveDrawer, PrivateRoute, ShowFollowedUsers } from './components/exports'
import { Grid, Hidden, Box } from '@material-ui/core';
import Login from './main/login';
import Register from './main/register';
import Profile from './main/profile';
import PersonalFeed from './main/PersonalFeed';
import PrivateChat from './main/privateChat';
import HashtagFeed from './main/HashtagFeed';
import HashtagsStats from './main/HashtagStats';

const exclusionArray = [
    '/login',
    '/register',
    '/private'
]

const Friends = () => (
    <Hidden mdDown>
        <Grid item xs={2} style={{ marginLeft: "100px" }}>       
                <ShowFollowedUsers></ShowFollowedUsers>
        </Grid>  
    </Hidden>
)

const News = () => (
    <Hidden mdDown>
        <Grid item xs={2} style={{ marginRight: "100px" }}>
            
        </Grid>  
    </Hidden>
)

const App = ({location}) => (

        <ResponsiveDrawer
            content={
                <Grid
                    style={{ marginTop: "5rem", height: "100%", }}
                    container
                    direction="row"
                    justify="center"
                    spacing={1}
                >
                    {exclusionArray.join().includes(location.pathname) == false && <News/>}
                    <Grid item xs={7} lg={4}>  
                        <Switch>
                            <Route exact path="/login" component={Login} />
                            <Route exact path="/register" component={Register} />
                            <PrivateRoute exact path="/" component={GlobalFeed} />
                            <PrivateRoute exact path="/feed" component={GlobalFeed} />
                            <PrivateRoute path="/profile/:id" component={Profile} />
                            <PrivateRoute exact path="/profile" component={Profile} />
                            <PrivateRoute exact path="/personal" component={PersonalFeed} />
                            <PrivateRoute path="/private/:id" component={PrivateChat} />
                            <PrivateRoute exact path="/hashtags" component={HashtagsStats} />
                            <PrivateRoute path="/hashtags/:tag" component={HashtagFeed} />
                        </Switch>
                    </Grid>
                    {exclusionArray.join().includes(location.pathname) == false && <Friends/>}
                </Grid>
            }
            loc={location.pathname}>
        </ResponsiveDrawer>           
)

export default withRouter(App)