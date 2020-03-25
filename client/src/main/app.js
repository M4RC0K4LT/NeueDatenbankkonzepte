import React from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Grid, Hidden, Box } from '@material-ui/core';
import { ResponsiveDrawer, PrivateRoute, ShowFollowedUsers, ShowRecentHashtags } from '../components/exports';
import GlobalFeed from "./GlobalFeed";
import Login from './login';
import Register from './register';
import Profile from './profile';
import PersonalFeed from './PersonalFeed';
import PrivateChat from './privateChat';
import HashtagFeed from './HashtagFeed';
import HashtagsStats from './HashtagStats';

/** Where not to show the sidebars */
const exclusionArray = [
    '/login',
    '/register',
]

/** FollowedUsers/Friends and top-5 hashtags sidebar */
const Friends = () => (
    <Hidden mdDown>
        <Grid item xs={2} style={{ marginLeft: "100px" }}>      
            <Box style={{ position: "sticky", top: "100px", left: "0", width: "100%"}}>
                <ShowFollowedUsers></ShowFollowedUsers>
                <ShowRecentHashtags></ShowRecentHashtags>
            </Box> 
        </Grid>  
    </Hidden>
)

/** Currently not in use - just as placeholder */
const News = () => (
    <Hidden mdDown>
        <Grid item xs={2} style={{ marginRight: "100px" }}>
            
        </Grid>  
    </Hidden>
)

/** Main Application with included React-Router */
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
                    {exclusionArray.join().includes(location.pathname) === false && <News/>}
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
                            <PrivateRoute path="/following" component={ShowFollowedUsers} />
                        </Switch>
                    </Grid>
                    {exclusionArray.join().includes(location.pathname) === false && <Friends/>}
                </Grid>
            }
            loc={location.pathname}>
        </ResponsiveDrawer>           
)

export default withRouter(App)