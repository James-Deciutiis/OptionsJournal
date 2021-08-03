import React, { Component } from 'react'
import {Switch, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import List from './pages/List'
import Login from './pages/Login'
import Register from './pages/Register'
import Account from './pages/Account'
import Journal from './pages/Journal'
import Record from './pages/Record'
import ChangePassword from './pages/ChangePassword'
import Suggestions from './pages/Suggestions'
import Logout from './pages/Logout'
import Trade from './pages/Trade'
import EditTrade from './pages/EditTrade'
import Navbar from './components/Navbar'

class App extends Component{
	render(){
		const App = () => (
		<div>
			<Switch>
				<Route path='/login' component={Login}/>
				<Route exact path='/' component={Home}/>
				<Route path='/register' component={Register}/>
				<div>
					<Navbar/>
					<Route path='/list' component={List}/>
					<Route path='/account' component={Account}/>
					<Route path='/journal' component={Journal}/>
					<Route path='/record' component={Record}/>
					<Route path='/change-password' component={ChangePassword}/>
					<Route path='/suggestions' component={Suggestions}/>
					<Route path='/logout' component={Logout}/>
					<Route path='/trade' component={Trade}/>
					<Route path='/edit-trade' component={EditTrade}/>
				</div>
    	    		</Switch>
     		</div>
    	)
    
		return (
	      <Switch>
    	    <App/>
	      </Switch>
    	)
  }
}

export default App
