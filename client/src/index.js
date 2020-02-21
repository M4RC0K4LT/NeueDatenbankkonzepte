import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './app';
import './index.css';

window.$apiroute = "http://localhost:3000";


class Index extends React.Component{
    render(){

    return (
        <Router>
            <App></App>          
        </Router>
    );
  }
}

ReactDOM.render(<Index />, document.getElementById('root'))