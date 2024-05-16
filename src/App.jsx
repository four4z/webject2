import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import WelcomeScreen from './WelcomeScreen';
import SignInScreen from './SignInScreen';
import RegisterScreen from './RegisterScreen';
import FridgeScreen from './FridgeScreen';
import ProfileScreen from './ProfileScreen';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={WelcomeScreen} />
        <Route path="/signin" component={SignInScreen} />
        <Route path="/register" component={RegisterScreen} />
        <Route path="/fridge" component={FridgeScreen} />
        <Route path="/profile" component={ProfileScreen} />
      </Switch>
    </Router>
  );
};

export default App;
