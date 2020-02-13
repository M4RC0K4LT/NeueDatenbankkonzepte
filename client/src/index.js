import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom'
import GlobalFeed from "./main/GlobalFeed"
import { ResponsiveDrawer, PrivateRoute } from './components/exports'
import { Container } from '@material-ui/core';
import Login from './main/login';
import Register from './main/register';

window.$apiroute = "http://localhost:3000";

class Index extends React.Component{

  render(){
      
    let content = (
        <Container style={{ marginTop: "5rem" }}>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <PrivateRoute exact path="/" component={GlobalFeed} />
                <PrivateRoute exact path="/feed" component={GlobalFeed} />
            </Switch>
        </Container>
    )

    return (
        <Router>
            <ResponsiveDrawer
                /*user={user}*/
                content={content}
                /*posted={posted}
                likes={likes}*/>
            </ResponsiveDrawer>           
        </Router>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'))