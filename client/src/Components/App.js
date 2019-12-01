import React from 'react';
import './App.css';
import NavBar from './NavBar';
import {Route } from 'react-router-dom'

import MainSearchBox from './MainSearchBox'
import IndexPage from './IndexPage';
class App extends React.Component {
  
  render(){
    return (
      
        <div className="container-fluid p-0">
            <NavBar />
            <Route exact path='/' component={MainSearchBox}/>
            <Route path='/IndexPage' component={IndexPage}/>
        </div>
    );
  }
  
}

export default App;
