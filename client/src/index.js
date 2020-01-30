import React from 'react';
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import ReactDOM from 'react-dom'
import GlobalFeed from "./GlobalFeed"
import 'bootstrap/dist/css/bootstrap.css';

class Routing extends React.Component{

  constructor(props) {
    super(props);
  }

  render(){
      
    return (
        <Router>
            <div>

                <div style={{ textAlign: "center" }}>
                    <nav class="navbar navbar-expand-md navbar-dark bg-dark fixed-top">
                            <Link class="navbar-brand" to="/">Tweety</Link>
                        <button aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation"
                                class="navbar-toggler" data-target="#navbarsExampleDefault" data-toggle="collapse" type="button">
                        <span class="navbar-toggler-icon"></span>
                        </button>

                        <div class="collapse navbar-collapse" id="navbarsExampleDefault">
                        <ul class="navbar-nav mr-auto">
                            <li class="nav-item">
                                <Link class="nav-link" to="/feed">Feed</Link>
                            </li>
                        </ul>
                        </div>
                    </nav>        
                </div>

                
                <div style={{ marginTop: "5rem" }} class="container">
                    <Switch>
                        <Route exact path="/" component={GlobalFeed} />
                        <Route path="/feed" component={GlobalFeed} />
                    </Switch>
                </div>
            </div>

        </Router>
    );
  }
}

ReactDOM.render(<Routing />, document.getElementById('root'))