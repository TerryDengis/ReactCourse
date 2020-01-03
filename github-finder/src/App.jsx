import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './component/layout/Navbar';
import User from './component/users/User';
import Alert from './component/layout/Alert';
import About from './component/pages/About';
import Home from './component/pages/Home';
import GithubState from './context/github/GithubState';
import AlertState from './context/alert/AlertState';
import NotFound from './component/pages/NotFound';

import './App.css';

const App = () => {
  // render the pages
  return (
    <GithubState>
      <AlertState>
        <Router>
          <div className="App">
            <Navbar title="Github Finder" icon="fab fa-github" />
            <div className="container">
              <Alert />
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/about" component={About} />
                <Route exact path="/user/:login" component={User} />
                <Route component={NotFound} />
              </Switch>
            </div>
          </div>
        </Router>
      </AlertState>
    </GithubState>
  );
};

export default App;
