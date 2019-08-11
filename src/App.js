import React from 'react'

import {BrowserRouter as Router, Route, Redirect} from 'react-router-dom'

import AuthRoute from './components/AuthRoute'

import Home from './pages/Home'
// import MapCont from './pages/Map'
// import CityList from './pages/CityList'
// import HouseDeatil from './pages/HouseDetail'
// import Login from './pages/Login'
// import Favorate from './pages/Favorate'
// import Rent from './pages/Rent'
// import Add from './pages/Rent/Add'
const MapCont = React.lazy(() => import('./pages/Map'))
const CityList = React.lazy(() => import('./pages/CityList'))
const HouseDeatil = React.lazy(() => import('./pages/HouseDetail'))
const Login = React.lazy(() => import('./pages/Login'))
const Favorate = React.lazy(() => import('./pages/Favorate'))
const Rent = React.lazy(() => import('./pages/Rent'))
const Add = React.lazy(() => import('./pages/Rent/Add'))

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
        {/* <Route path="/favorate" component={Favorate} /> */}
        <AuthRoute path="/favorate" component={Favorate} />
        <Route path="/rent" exact component={Rent} />
        <Route path="/rent/add" component={Add} />
      </Router>
    )
  }
}
