import React from 'react'

import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'

import Home from './pages/Home'
import MapCont from './pages/Map'
import CityList from './pages/CityList'
import HouseDeatil from './pages/HouseDetail'
import Login from './pages/Login'

export default class extends React.Component {
  render() {
    return (
      <Router>
        {/* /重定向到/home */}
        <Route path="/" exact render={() => <Redirect to="/home" />} />
        <Route path="/home" component={Home} />
        <Route path="/map" component={MapCont} />
        <Route path="/citylist" component={CityList} />
        <Route path="/deatil/:id" component={HouseDeatil} />
        <Route path="/login" component={Login} />
      </Router>
    )
  }
}
