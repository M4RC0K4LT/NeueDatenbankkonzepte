import React from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom'
import GlobalFeed from "./GlobalFeed"
import ResponsiveDrawer from './responsiveDrawer'
import { Container } from '@material-ui/core';

class Index extends React.Component{

  render(){
      
    let content = (
        <Container style={{ marginTop: "5rem" }}>
            <Switch>
                <Route exact path="/" component={GlobalFeed} />
                <Route path="/feed" component={GlobalFeed} />
            </Switch>
        </Container>
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